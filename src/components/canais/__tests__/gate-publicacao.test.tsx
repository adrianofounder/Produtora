import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { PacoteTab } from '../tabs/PacoteTab'
import * as videoDrawerHooks from '../hooks/useVideoDrawer'

vi.mock('../hooks/useVideoDrawer', () => ({
  useVideoDrawer: vi.fn()
}))

describe('BUG-01 Gate de Publicação (PacoteTab)', () => {
  it('deve manter o botão de agendar desabilitado e avisar se o áudio não foi aprovado', () => {
    vi.spyOn(videoDrawerHooks, 'useVideoDrawer').mockReturnValue({
      videoId: '123',
      titulo: 'Video de Teste',
      aprovado: { roteiro: true, audio: false, thumb: true },
      onClose: vi.fn(),
      onUpdate: vi.fn(),
      setAbaAtiva: vi.fn(),
      setAprovado: vi.fn()
    } as any)

    render(<PacoteTab />)
    
    const agendarBtn = screen.getByRole('button', { name: /agendar publicação/i })
    expect(agendarBtn).toBeDisabled()
    expect(screen.getByText('• Narração não aprovada')).toBeInTheDocument()
  })

  it('deve habilitar o botão de agendar se todas as etapas estiverem aprovadas', () => {
    vi.spyOn(videoDrawerHooks, 'useVideoDrawer').mockReturnValue({
      videoId: '123',
      titulo: 'Video de Teste',
      aprovado: { roteiro: true, audio: true, thumb: true },
      onClose: vi.fn(),
      onUpdate: vi.fn(),
      setAbaAtiva: vi.fn(),
      setAprovado: vi.fn()
    } as any)

    render(<PacoteTab />)
    
    const agendarBtn = screen.getByRole('button', { name: /agendar publicação/i })
    expect(agendarBtn).not.toBeDisabled()
    expect(screen.queryByText(/não aprovada/i)).not.toBeInTheDocument()
  })

  it('deve manter o botão desabilitado e avisar se o roteiro não foi aprovado', () => {
    vi.spyOn(videoDrawerHooks, 'useVideoDrawer').mockReturnValue({
      videoId: '123',
      titulo: 'Video de Teste',
      aprovado: { roteiro: false, audio: true, thumb: true },
      onClose: vi.fn(),
      onUpdate: vi.fn(),
      setAbaAtiva: vi.fn(),
      setAprovado: vi.fn()
    } as any)

    render(<PacoteTab />)
    
    expect(screen.getByRole('button', { name: /agendar publicação/i })).toBeDisabled()
    expect(screen.getByText('• Roteiro não aprovado')).toBeInTheDocument()
  })

  it('deve manter o botão desabilitado e avisar se a thumb não foi aprovada', () => {
    vi.spyOn(videoDrawerHooks, 'useVideoDrawer').mockReturnValue({
      videoId: '123',
      titulo: 'Video de Teste',
      aprovado: { roteiro: true, audio: true, thumb: false },
      onClose: vi.fn(),
      onUpdate: vi.fn(),
      setAbaAtiva: vi.fn(),
      setAprovado: vi.fn()
    } as any)

    render(<PacoteTab />)
    
    expect(screen.getByRole('button', { name: /agendar publicação/i })).toBeDisabled()
    expect(screen.getByText('• Thumbnail não aprovada')).toBeInTheDocument()
  })
})
