import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../store/language';

export interface Drama {
  id: string;
  title: string;
  cover: string;
  episodes: number;
}

export const useDramas = () => {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    setDramas([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    
    fetch(`/api/foryou?page=1&lang=${lang}`)
      .then(res => res.json())
      .then(data => {
        const list = data.data || [];
        setDramas(list);
        setHasMore(list.length >= 20);
        setPage(2);
      })
      .finally(() => setLoading(false));
  }, [lang]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    
    fetch(`/api/foryou?page=${page}&lang=${lang}`)
      .then(res => res.json())
      .then(data => {
        const list = data.data || [];
        setDramas(prev => [...prev, ...list]);
        setHasMore(list.length >= 20);
        setPage(p => p + 1);
      })
      .finally(() => setLoading(false));
  }, [page, lang, loading, hasMore]);

  return { dramas, loading, hasMore, loadMore };
};

export const useRank = () => {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/rank?lang=${lang}`)
      .then(res => res.json())
      .then(data => setDramas(data.data || []))
      .finally(() => setLoading(false));
  }, [lang]);

  return { dramas, loading };
};

export const useChapters = (id: string | undefined) => {
  const [chapters, setChapters] = useState<any[]>([]);
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/chapters?id=${id}&lang=${lang}`)
      .then(res => res.json())
      .then(data => {
        setChapters(data.data?.list || []);
        setDetail({ title: data.data?.title, cover: data.data?.cover });
      })
      .finally(() => setLoading(false));
  }, [id, lang]);

  return { chapters, detail, loading };
};

export const useStream = () => {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { lang } = useLanguage();

  const loadStream = useCallback((id: string, ep: number) => {
    setLoading(true);
    setStreamUrl(null);
    fetch(`/api/stream?id=${id}&ep=${ep}&lang=${lang}`)
      .then(res => res.json())
      .then(data => {
        const url = data.data?.hls_url;
        if (url) setStreamUrl(`/api/video?url=${encodeURIComponent(url)}`);
      })
      .finally(() => setLoading(false));
  }, [lang]);

  return { streamUrl, loading, loadStream };
};
