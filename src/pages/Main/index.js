import { Container, Form, SubmitButton, List, DeleteButton } from './styles';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
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

  const handleDelete = useCallback(
    (repo) => {
      const filter = repositories.filter((r) => r.name !== repo);
      setRepositories(filter);
    },
    [repositories]
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

      <List>
        {repositories.map((repository) => (
          <li key={repository.name}>
            <span>
              <DeleteButton onClick={() => handleDelete(repository.name)}>
                <FaTrash size={14} />
              </DeleteButton>
              {repository.name}
            </span>
            <a href=''>
              <FaBars size={20} />
            </a>
          </li>
        ))}
      </List>
    </Container>
  );
}
