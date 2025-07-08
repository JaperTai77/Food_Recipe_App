from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI

from core.config import Variable

def run_ollama_chain(system_prompt:str, user_prompt:str, t:float=0.7)->str:
    llm = ChatOllama(
        model="llama3.2:3b",
        temperature=t,
        keep_alive=60,
        base_url="http://localhost:11434"
    )
    message = [
        ("system", system_prompt), ("human", user_prompt),
    ]
    response = llm.invoke(message)
    return response.content

def run_openai_chain(system_prompt:str, user_prompt:str, t:float=0.7)->str:
    llm = ChatOpenAI(
        model=Variable.OPENAI_MODEL,
        temperature=t,
        max_retries=2,
        request_timeout=180
    )
    message = [
        ("system", system_prompt), ("human", user_prompt),
    ]
    response = llm.invoke(message)
    return response.content