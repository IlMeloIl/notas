from fastapi import FastAPI, HTTPException, Depends
from typing import List, Optional
from sqlmodel import Field, Session, SQLModel, create_engine, select
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

class NotaBase(SQLModel):
    title: str
    content: Optional[str] = None

class Nota(NotaBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    createdAt: Optional[datetime] = Field(default_factory=datetime.now, nullable=False)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.now, sa_column_kwargs={"onupdate": datetime.now}, nullable=False)

class NotaCreate(NotaBase):
    pass

class NotaRead(NotaBase):
    id: int
    createdAt: datetime
    updatedAt: datetime

DATABASE_FILE = "database.sqlite"
engine = create_engine(f"sqlite:///{DATABASE_FILE}", echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_session():
    with Session(engine) as session:
        yield session

@app.post("/notas/", response_model=NotaRead, status_code=201)
def criar_nota(nota: NotaCreate, session: Session = Depends(get_session)):
    db_nota = Nota.from_orm(nota)
    session.add(db_nota)
    session.commit()
    session.refresh(db_nota)
    return db_nota

@app.get("/notas/", response_model=List[NotaRead])
def listar_notas(session: Session = Depends(get_session)):
    notas = session.exec(select(Nota)).all()
    return notas

@app.get("/notas/{nota_id}", response_model=NotaRead)
def ler_nota(nota_id: int, session: Session = Depends(get_session)):
    nota = session.get(Nota, nota_id)
    if not nota:
        raise HTTPException(status_code=404, detail="Nota não encontrada")
    return nota

@app.put("/notas/{nota_id}", response_model=NotaRead)
def atualizar_nota(nota_id: int, nota_data: NotaCreate, session: Session = Depends(get_session)):
    db_nota = session.get(Nota, nota_id)
    if not db_nota:
        raise HTTPException(status_code=404, detail="Nota não encontrada")
    
    nota_dict = nota_data.dict(exclude_unset=True)
    for key, value in nota_dict.items():
        setattr(db_nota, key, value)
        
    session.add(db_nota)
    session.commit()
    session.refresh(db_nota)
    return db_nota

@app.delete("/notas/{nota_id}", status_code=204)
def deletar_nota(nota_id: int, session: Session = Depends(get_session)):
    nota = session.get(Nota, nota_id)
    if not nota:
        raise HTTPException(status_code=404, detail="Nota não encontrada")
    
    session.delete(nota)
    session.commit()
    return