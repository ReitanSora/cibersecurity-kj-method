import { useEffect, useState } from 'react';
import './App.css'
import { fetchOpenAiResponse } from '../utils/services/OpenAi.tsx';
import { fetchCalification } from '../utils/services/Calificar.tsx';

function App() {
  const [problem, setProblem] = useState('')
  const [isReviewed, setIsReviewed] = useState(false);
  const [calification, setCalification] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState();
  const [ideas, setIdeas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState('');
  const [nextid, setNextid] = useState(0);
  let aux = [];

  const generateResponses = async (problem: string) => {
    setIsLoading(true);
    await fetchOpenAiResponse(problem)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setResponse(data);
        aux = data;
      })
      .catch(e => {
        console.error(e);
      });
  };

  const review = async () => {
    await fetchCalification(aux.correct, getList(2))
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsReviewed(true);
        setCalification(data);
        setIsLoading(false);
      })
      .catch(e => {
        console.error(e);
      });
  };

  const getList = (data) => {
    return ideas.filter(item => item.list === data)
  }

  const startDrag = (event, item) => {
    event.dataTransfer.setData('itemID', item.id)
    console.log(item);
  }

  const dragginOver = (event) => {
    event.preventDefault();
  }

  const onDrop = (event, list) => {
    const itemID = event.dataTransfer.getData('itemID');
    const item = ideas.find(item => item.id == itemID);
    item.list = list;

    const newState = ideas.map(element => {
      if (element.id === itemID) return item;
      return element
    })

    setIdeas(newState)
  }

  return (
    <>
      <div className='page-container'>
        <div className="instruction">
          <h1>Método KJ - Continuidad del negocio</h1>
          <input type='text' onChange={newText => setProblem(newText.target.value)} defaultValue={problem} placeholder='Ingrese el problema'></input>
        </div>
        <div className="actions-container">
          {isLoading ? <img src='../../public/loading2.svg' className='loading'></img>
            :
            <div className="actions">
              <button type='submit' onClick={async () => {
                await generateResponses(problem);
                await review();
              }}>Calificar</button>
              <button onClick={() => setIdeas([])}>Reiniciar</button>
              <button onClick={() => setIsModalOpen(true)}>Crear Idea</button>
            </div>}
        </div>
        <div className="container">
          <div className="title">
            <h3>Lluvia de ideas:</h3>
          </div>
          <div className="container-idea" onDragOver={(ev => dragginOver(ev))} onDrop={(ev => onDrop(ev, 1))}>
            {getList(1).map(element =>
              <div className="idea" key={element.id} draggable='true' onDragStart={(ev) => startDrag(ev, element)}>
                <p>{element.body}</p>
                <div className="shadow"></div>
              </div>
            )}
          </div>
          <div className="title">
            <h3>Respuestas para calificar:</h3>
          </div>
          <div className="container-solution" onDragOver={(ev => dragginOver(ev))} onDrop={(ev => onDrop(ev, 2))}>
            {getList(2).map(element =>
              <div className="idea" key={element.id} draggable='true' onDragStart={(ev) => startDrag(ev, element)}>
                <p>{element.body}</p>
                <div className="shadow"></div>
              </div>
            )}
          </div>
        </div>
        {isReviewed ?
          <div className="result">
            <div className="result-ideas">
              <h3>Posibles respuestas correctas:</h3>
              <ul>
                {response.correct.map(element =>
                  <li>{element}</li>
                )}
              </ul>
              <h3>Respuestas incorrectas:</h3>
              <ul>
                {response.incorrect.map(element =>
                  <li>{element}</li>
                )}
              </ul>
            </div>
            <div className="result-calification">
              <h3>Calificación:</h3>
              <p>{calification.calification}</p>
            </div>
          </div> : <></>}
      </div>
      {isModalOpen ?
        <div className='modal'>
          <div className="modal-container">
            <h3>Crear nota</h3>
            <input type='text' placeholder='Escriba la idea' onChange={newText => setText(newText.target.value)} defaultValue={text}></input>
            <button onClick={() => { setNextid(nextid + 1); setIdeas([...ideas, { id: nextid, body: text, list: 1 }]); setIsModalOpen(false); setText(''); }}>Crear</button>
            <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
          </div>
        </div> : <></>}
    </>
  )
}

export default App
