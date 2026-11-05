import { useState} from 'react';
import api from './services/api'; //aqui ele ta puxando o arquivo que conecta as portas 5137 e 8080
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import Cadastro from './Cadastro';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [data, setData] = useState('');

  const navigate = useNavigate();

  const buscarAgendamentos = async () => {
    try {
      //Chamando o GET
      const resposta = await api.get(`/agendamento?data=${data}`); //a crase é usada pra colocar uma variável no meio do texto
      setAgendamentos(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar: ", erro);
      alert("Erro ao buscar agendamentos.");
    }
  };

  const editarAgendamento = (agendamento) => {
    localStorage.setItem('agendamentoParaEditar', JSON.stringify(agendamento));

    navigate('/cadastro');
  };

  const onDelete = async (agendamento) => {
    const confirmou = window.confirm(`Tem certeza que deseja excluir este agendamento?`);

    if (!confirmou) return; //se o usuario licar em "cancelar" ela para aqui

    try {
      await api.delete('/agendamento', {
        params: {
          cliente: agendamento.cliente,
          dataHoraAgendamento: agendamento.dataHoraAgendamento
        }
      });

      buscarAgendamentos();

    } catch (erro) {
      console.erro("Erro ao deletar: ", erro);
      alert("Erro ao deletar agendamento.");
    }
  };


  return ( //é o que a função App vai entregar
    <div className='container'>
      <h1>Agenda do Salão</h1>
      
      <div className='filtro'>
        <label>Data: </label>
        <input
          type="date" 
          value={data} 
          onChange={(e) => setData(e.target.value)} 
        />
        <button onClick={buscarAgendamentos}>
          Buscar Agenda
        </button>
      </div>

      {/*Aqui é uma condicional. Se a lista for zero, mostre a mensagem de nenhum agendamento encontrado. Se não, puxa os dados e transforma em tabela*/}
      {agendamentos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Nenhum agendamento encontrado para esta data.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Horário</th>
              <th>Cliente</th>
              <th>Telefone</th>
              <th>Serviço</th>
              <th>Profissional</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {agendamentos.map((agendamento) => ( //o .map tá dizendo "pra cada agendamento na minha lista, transforme em uma linha nessa minha tabela"
              <tr key={agendamento.id}> {/*o react precisa de um identidade em cada linha pra nao se perder*/}
                {/*Formatando a data que vem do Java pq ele manda assim -> "2026-10-23T08:00" e o react transforma em horario normal tipo 08:00 pt-br*/}
                <td>{new Date(agendamento.dataHoraAgendamento).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
                <td>{agendamento.cliente}</td>
                <td>{agendamento.telefoneCliente}</td>
                <td>{agendamento.servico}</td>
                <td>{agendamento.profissional}</td>

                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => editarAgendamento(agendamento)}  style={{ backgroundColor: '#f0ad4e'}}>
                      Editar
                    </button>
                    
                    <button onClick={() => onDelete(agendamento)} style={{ backgroundColor: '#ff4d4d' }}>
                      Excluir
                    </button>
                </div>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function App(){
  return (
    <div>
      <nav>
        <Link to="/">Ver Agenda</Link>
        <Link to="/cadastro">Novo Agendamento</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro/>} />
      </Routes>
    </div>
  );
}

export default App;