from utility.langchain_ollama import run_ollama_chain
import torch
import io
import base64

class ImagePromptGenerator:
        def __init__(self, user_input, CUISINE_NAME):
            self.system_prompt = f"You generate image prompt."
            self.user_prompt = f"""
            This is the user's feeling and the meal they will have.
            <feeling>{user_input}</feeling>
            <meal>{CUISINE_NAME}</meal>

            You generate a prompt for stable diffusion image generation. The image should be elegant, clean, and simple.
            Restriction:
            - don't explain or illustrate. only reply the answer
            - no more than 50 words
            - only show the food no utensils, no human or people, no text or logo
            - be precise no unnecessary background item
            - do not block the food or meal
            """
        
        def generate(self):
            response = run_ollama_chain(self.system_prompt, self.user_prompt, t=0.2)
            return response

class ImageRepository(ImagePromptGenerator):
    def __init__(self, user_input, CUISINE_NAME, model_pipeline):
        super().__init__(user_input, CUISINE_NAME)
        self.pipeline = model_pipeline
    
    @classmethod
    def move_to_gpu(cls, user_input, CUISINE_NAME, model_pipeline):
        if torch.cuda.is_available():
            device = torch.device("cuda")
            model_pipeline = model_pipeline.to(device)
        elif torch.backends.mps.is_available():
            device = torch.device("mps")
            model_pipeline = model_pipeline.to(device)
            model_pipeline.enable_attention_slicing()
        return cls(user_input, CUISINE_NAME, model_pipeline)
    
    def generate_image(self):
        response = self.generate()
        print(response)
        image = self.pipeline(
            prompt=response, guidance_scale=4.5, 
            negative_prompt="unstructured, low quality, messy, unclean, unorganized, dirty", steps=40
        ).images[0]
        saved_path = rf"data/{response.replace(" ","").replace(".","")[1:20]}.jpg"
        im_file = io.BytesIO()
        image.save(im_file, format="JPEG")
        image_base64 = base64.b64encode(im_file.getvalue())#.decode("utf-8")
        return image_base64
