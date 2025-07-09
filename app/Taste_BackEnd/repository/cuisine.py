from utility.openai_chain import run_openai_chain


class CuisineRepository:
    def __init__(self, user_prompt):
        self.user_prompt = user_prompt
        self.system_prompt = """
        You recommend one not too common meal or food according to user's input. 
        The user will provide a short description or information, recommend a specific one with its full name base on it. 
        Don't explain or provide any information about the cuisine or user input. Just recommand one meal or food in full name.
        """

    def chat(self):
        response = run_openai_chain(self.system_prompt, self.user_prompt, t=0.6)
        return response