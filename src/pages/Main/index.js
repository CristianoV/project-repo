import { Container, Form, SubmitButton } from './styles';
import { FaGithub, FaPlus, FaSpinner } from 'react-icons/fa';
import { useCallback, useState } from 'react';

import api from '../../services/api';

export default function Main() {
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      async function submit() {
        setLoading(true);
        try {
          const response = await api.get(`/repos/${newRepo}`);

          const data = {
            name: response.data.full_name,
          };

          setRepositories([...repositories, data]);
          setNewRepo('');
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
      submit();
    },
    [newRepo, repositories]
  );

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
        <SubmitButton Loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color='#fff' size={14} />
          ) : (
          <FaPlus color='#fff' size={14} />
          )}
        </SubmitButton>
      </Form>
    </Container>
  );
}
