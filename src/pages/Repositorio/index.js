import { useEffect, useState } from 'react';
import { Container } from './styles';
import api from '../../services/api';

export default function Repositorio({ match }) {
  const [repositorio, setRepositorio] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const repoName = decodeURIComponent(match.params.repository);

      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${repoName}`),
        api.get(`/repos/${repoName}/issues`, {
          params: {
            state: 'open',
            per_page: 5,
          },
        }),
      ]);

      setRepositorio(repositorioData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }
    loadData();
  }, [match.params.repository]);

  return <Container>Repositorio</Container>;
}
