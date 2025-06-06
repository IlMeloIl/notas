from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="API de Notas",
    description="Uma API simples para gerenciar notas.",
    version="1.0.0"
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NotaBase(BaseModel):
    title: str
    content: Optional[str] = None

class Nota(NotaBase):
    id: str

db_notas: List[Nota] = [
    Nota(id=str(uuid.uuid4()), title="Nota de Exemplo da API", content="Se você está vendo isso, a conexão funcionou!")
]

@app.post("/notas/", response_model=Nota, status_code=201)
def criar_nota(nota_data: NotaBase):
    """
    Cria uma nova nota.
    - Recebe um `title` e um `content` opcional.
    - Gera um `id` único.
    - Adiciona a nova nota à lista `db_notas`.
    - Retorna a nota completa que foi criada.
    """
    nova_nota = Nota(
        id=str(uuid.uuid4()),
        title=nota_data.title,
        content=nota_data.content
    )
    db_notas.append(nova_nota)
    return nova_nota

@app.get("/notas/", response_model=List[Nota])
def listar_notas():
    """
    Retorna uma lista com todas as notas existentes.
    """
    return db_notas

@app.get("/notas/{nota_id}", response_model=Nota)
def ler_nota(nota_id: str):
    """
    Retorna uma nota existente.
    - Busca a nota pelo `nota_id`
    - Se não encontrar, retorna um error 404.
    - Se encontrar, retorna a nota.
    """
    for nota in db_notas:
        if nota.id == nota_id:
            return nota
    raise HTTPException(status_code=404, detail="Nota não encontrada")

@app.put("/notas/{nota_id}", response_model=Nota)
def atualizar_nota(nota_id: str, nota_data: NotaBase):
    """
    Atualiza uma nota existente.
    - Busca a nota pelo `nota_id`.
    - Se não encontrar, retorna um erro 404.
    - Se encontrar, atualiza o `title` e/ou `content`.
    - Retorna a nota atualizada.
    """
    for index, nota in enumerate(db_notas):
        if nota.id == nota_id:
            nota_atualizada = nota.copy(update=nota_data.dict(exclude_unset=True))
            db_notas[index] = nota_atualizada
            return nota_atualizada
    raise HTTPException(status_code=404, detail="Nota não encontrada")

@app.delete("/notas/{nota_id}", status_code=204)
def deletar_nota(nota_id: str):
    """
    Deleta uma nota existente.
    - Busca a nota pelo `nota_id`.
    - Se não encontrar, retorna um erro 404.
    - Se encontrar, remove a nota da lista.
    - Retorna uma resposta de sucesso sem conteúdo (204).
    """
    nota_encontrada = next((nota for nota in db_notas if nota.id == nota_id), None)
    if not nota_encontrada:
        raise HTTPException(status_code=404, detail="Nota não encontrada")
    db_notas.remove(nota_encontrada)
    return