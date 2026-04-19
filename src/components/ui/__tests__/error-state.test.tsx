import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ErrorState } from '../error-state'

describe('ErrorState', () => {
  it('deve renderizar a mensagem de erro corretamente', () => {
    render(<ErrorState message="Erro ao conectar com API" />)
    
    expect(screen.getByText('Algo deu errado')).toBeInTheDocument()
    expect(screen.getByText('Erro ao conectar com API')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /tentar novamente/i })).not.toBeInTheDocument()
  })

  it('deve renderizar título customizado', () => {
    render(<ErrorState title="Atenção" message="Falha na rede" />)
    expect(screen.getByText('Atenção')).toBeInTheDocument()
  })

  it('deve renderizar botão retry se onRetry for fornecido e disparar evento no clique', async () => {
    const handleRetry = vi.fn()
    render(<ErrorState message="Erro temporário" onRetry={handleRetry} />)
    
    const retryButton = screen.getByRole('button', { name: /tentar novamente/i })
    expect(retryButton).toBeInTheDocument()
    
    await userEvent.click(retryButton)
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })
})
