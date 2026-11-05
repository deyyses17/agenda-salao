import { useState, useEffect } from 'react';
import api from './services/api';
import { data, useNavigate } from 'react-router-dom';
import './App.css';

function Cadastro(){
    const [cliente, setCliente] = useState(''); //cria uma variável chamada cliente, devolve uma função chamada setCliente para mudar o valor dela. o valor inicial é vazio ("") e avisa ao react sempre que mudar
    const [telefoneCliente, setTelefoneCliente] = useState('');
    const [servico, setServico] = useState('');
    const [profissional, setProfissional] = useState('');
    const [dataHoraAgendamento, setdataHoraAgendamento] = useState('');
    const [agendamentoAntigo, setAgendamentoAntigo] = useState(null);

    useEffect(() => {

        const itemSalvo = localStorage.getItem('agendamentoParaEditar');
        if (itemSalvo) {
            const agendamento = JSON.parse(itemSalvo);
            setAgendamentoAntigo(agendamento);
            setCliente(agendamento.cliente);
            setTelefoneCliente(agendamento.telefoneCliente);
            setServico(agendamento.servico);
            setProfissional(agendamento.profissional);
            setdataHoraAgendamento(agendamento.dataHoraAgendamento);

            localStorage.removeItem('agendamentoParaEditar');
        }
    }, []);

    const navigate = useNavigate();

    const salvarAgendamento = async (e) => {
        e.preventDefault();

        const agendamentoDados = {
        cliente: cliente,
        telefoneCliente: telefoneCliente,
        servico: servico,
        profissional: profissional,
        dataHoraAgendamento: dataHoraAgendamento
    };

        try {
            if(agendamentoAntigo){
                await api.put('/agendamento', agendamentoDados, {
                    params: {
                        cliente: agendamentoAntigo.cliente,
                        dataHoraAgendamento: agendamentoAntigo.dataHoraAgendamento
                    }
                });

                alert("Agendamento atualizado com sucesso!");
            } else {
                await api.post('/agendamento', agendamentoDados);
                alert("Agendamento cadastrado!");
            }
            
            navigate('/');

        } catch(erro){
            console.erro("Erro ao cadastrar: ", erro);
            alert("Erro ao cadastrar. Verifique o console.");
        }
    };

    return (
        <div className= "container">
            <h1>Novo Agendamento</h1>

            <form onSubmit={salvarAgendamento} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                <label>
                    Cliente:
                    <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
                </label>

                <label>
                    Telefone:
                    <input type="text" value={telefoneCliente} onChange={(e) => setTelefoneCliente(e.target.value)} required/>
                </label>

                <label>
                    Serviço:
                    <input type="text" value={servico} onChange={(e) => setServico(e.target.value)} />
                </label>

                <label>
                    Profissional:
                    <input type="text" value={profissional} onChange={(e) => setProfissional
                        (e.target.value)} />
                </label>

                <label>
                    Data e hora:
                    <input type="datetime-local" value={dataHoraAgendamento} onChange={(e) => setdataHoraAgendamento(e.target.value)} required />
                </label>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px'}}>
                    <button type="submit">
                        {agendamentoAntigo ? 'Atualizar' : 'Salvar'}
                    </button>

                    <button type="button" onClick={() => navigate('/')} style={{ backgroundColor: '#888'}}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Cadastro;