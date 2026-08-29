import { useState, useEffect, useCallback } from 'react';
import { HealthContent } from '../data/types';
import { MOCK_HEALTH_CONTENT } from '../data/mockData';

// Requisitos: 6.8, 6.9
export const useHealthContent = () => {
  const [contentData, setContentData] = useState<HealthContent>(MOCK_HEALTH_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      // Usando o IP da máquina na rede local para funcionar no emulador/celular
      const response = await fetch('http://192.168.1.30:3000/api/articles/search?q=');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar dados da API');
      }

      const data = await response.json();
      
      const publishedArticles = (data.articles || []).filter((a: any) => a.status === 'Publicado');
      if (publishedArticles.length > 0) {
        const article = publishedArticles[0];
        
        // Se a API não mandar um excerpt, removemos as tags HTML do content para criar uma descrição limpa
        const cleanContent = article.excerpt || article.content?.replace(/<[^>]+>/g, '').substring(0, 100) + '...';

        setContentData({
          id: article.id,
          title: article.title.substring(0, 60),
          description: cleanContent || 'Leia mais sobre saúde feminina.',
          imageAlt: 'Imagem de destaque do artigo',
        });
      }
    } catch (error) {
      console.error('Falha ao buscar artigos:', error);
      setHasError(true);
      // Se falhar, mantém o MOCK como fallback
      setContentData(MOCK_HEALTH_CONTENT);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { contentData, isLoading, hasError, retry: fetchContent };
};

