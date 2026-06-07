import { render, screen, fireEvent } from '@testing-library/react'
import { FanOutTab } from '../components/dashboard/tabs/fan-out-tab'

describe('FanOutTab', () => {
  const defaultProps = {
    prompt: '',
    personas: '',
    fanoutPrompts: [],
    busy: false,
    onPromptChange: jest.fn(),
    onPersonasChange: jest.fn(),
    onGenerateFanout: jest.fn(),
    onRunPrompt: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with empty state', () => {
    render(<FanOutTab {...defaultProps} />)
    
    expect(screen.getByText('Core Prompt')).toBeTruthy()
    expect(screen.getByText('Target Personas')).toBeTruthy()
    expect(screen.getByText('Generate Persona Fan-Out')).toBeTruthy()
    expect(screen.getByText('Run Core Prompt')).toBeTruthy()
    expect(screen.getByText('Queue is empty')).toBeTruthy()
  })

  it('disables generate button when inputs are empty', () => {
    render(<FanOutTab {...defaultProps} />)
    const generateBtn = screen.getByText('Generate Persona Fan-Out')
    expect(generateBtn).toBeDisabled()
  })

  it('enables generate button when prompt and personas are filled', () => {
    render(<FanOutTab {...defaultProps} prompt="test prompt" personas="CMO" />)
    const generateBtn = screen.getByText('Generate Persona Fan-Out')
    expect(generateBtn).not.toBeDisabled()
  })

  it('calls onGenerateFanout when button is clicked', () => {
    render(<FanOutTab {...defaultProps} prompt="test prompt" personas="CMO" />)
    const generateBtn = screen.getByText('Generate Persona Fan-Out')
    fireEvent.click(generateBtn)
    expect(defaultProps.onGenerateFanout).toHaveBeenCalledTimes(1)
  })

  it('renders fanout queue items correctly', () => {
    const prompts = ['Prompt 1 for CMO', 'Prompt 2 for SEO']
    render(<FanOutTab {...defaultProps} fanoutPrompts={prompts} />)
    
    expect(screen.getByText('Prompt 1 for CMO')).toBeTruthy()
    expect(screen.getByText('Prompt 2 for SEO')).toBeTruthy()
    expect(screen.queryByText('Queue is empty')).toBeNull()
  })
})
