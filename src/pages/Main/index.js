import { Container, Form, SubmitButton, List, DeleteButton } from './styles';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import { useCallback, useEffect, useState } from 'react';

import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function Main() {
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const repoStorage = localStorage.getItem('repos');
    if (repoStorage) {
      setRepositories(JSON.parse(repoStorage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('repos', JSON.stringify(repositories));
  }, [repositories]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      async function submit() {
        setLoading(true);
        setAlert(null);
        try {
          if (newRepo === '')
            throw new Error('Você precisa indicar um repositório');

          const response = await api.get(`/repos/${newRepo}`);

          const hasRepo = repositories.find(
            (r) => r.name === response.data.full_name
          );

          if (hasRepo) throw new Error('Repositório duplicado');

          const data = {
            name: response.data.full_name,
          };

          setRepositories([...repositories, data]);
          setNewRepo('');
        } catch (err) {
          setAlert(true);
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

      <Form onSubmit={handleSubmit} error={alert}>
        <input
          type='text'
          placeholder='Adicionar Repositorio'
          value={newRepo}
          onChange={(e) => {
            setNewRepo(e.target.value);
            setAlert(null);
          }}
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
            <Link to={`/repositorio/${encodeURIComponent(repository.name)}`}>
              <FaBars size={20} />
            </Link>
          </li>
        ))}
      </List>
    </Container>
  );
}
