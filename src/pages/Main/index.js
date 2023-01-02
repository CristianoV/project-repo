import { Container, Form, SubmitButton } from './styles';
import { FaGithub, FaPlus } from 'react-icons/fa';
import { useCallback, useState } from 'react';

import api from '../../services/api';

export default function Main() {
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState([]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    async function submit() {
      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      setRepositories([...repositories, data]);
      setNewRepo('');
    }
    submit();
  }, [newRepo, repositories]);

  return (
    <Container>
      <h1>
        <FaGithub size={25} />
        Meus Repositorios
      </h1>

      <Form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Adicionar Repositorio'
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
        />
        <SubmitButton>
          <FaPlus color='#fff' size={14} />
        </SubmitButton>
      </Form>
    </Container>
  );
}
