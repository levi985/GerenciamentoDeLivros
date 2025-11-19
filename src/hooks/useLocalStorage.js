import { useState, useEffect } from 'react';

export function useLocalStorage(chave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const itemArmazenado = localStorage.getItem(chave);
      return itemArmazenado ? JSON.parse(itemArmazenado) : valorInicial;
    } catch (erro) {
      console.error('Erro ao recuperar do localStorage:', erro);
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch (erro) {
      console.error('Erro ao salvar no localStorage:', erro);
    }
  }, [chave, valor]);

  return [valor, setValor];
}
