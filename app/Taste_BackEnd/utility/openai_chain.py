from openai import OpenAI

from core.config import Variable

def run_openai_chain(system_prompt:str, user_prompt:str, t:float=0.7)->str:
    client = OpenAI()
    response = client.responses.create(
        model=Variable.OPENAI_MODEL,
        input=[
            {
            "role": "system",
            "content": [
                {
                "type": "input_text",
                "text": system_prompt
                },
            ]
            },
            {
            "role": "user",
            "content": [
                {
                "type": "input_text",
                "text":  user_prompt
                }
            ]
            },
        ],
        text={
            "format": {
            "type": "text"
            }
        },
        temperature=t,
        max_output_tokens=20480,
        top_p=1,
        store=True
    )
    return response.output_text