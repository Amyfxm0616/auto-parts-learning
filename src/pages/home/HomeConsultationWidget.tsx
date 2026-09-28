import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { assistantService } from '../../features/assistant/assistant.service';
import type { AssistantExecutionPlan } from '../../entities/assistant/types';
import './home-consultation-widget.css';

type ConsultationMessage =
  | {
      id: string;
      role: 'assistant';
      type: 'welcome';
      content: string;
    }
  | {
      id: string;
      role: 'user';
      type: 'text';
      content: string;
    }
  | {
      id: string;
      role: 'assistant';
      type: 'analysis';
      content: string;
      prompt: string;
      plan: AssistantExecutionPlan;
    };

const SUGGESTED_QUESTIONS = [
  '帮我推荐门板骨架材料，并分析有没有减重降本机会',
  'EPDM 适合用于哪些汽车零部件？',
  '怎样为电池包选择阻燃材料？',
];

const WELCOME_MESSAGE: ConsultationMessage = {
  id: 'welcome',
  role: 'assistant',
  type: 'welcome',
  content: '你好，我是材料咨询助手。告诉我零件、性能需求或目标，我会生成初步分析和下一步建议。',
};

function createMessageId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatCapabilities(plan: AssistantExecutionPlan) {
  const capabilityNames = plan.capabilities.map((capability) => capability.name);
  return capabilityNames.length ? capabilityNames.join('、') : '智能选材分析';
}

export default function HomeConsultationWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ConsultationMessage[]>([
    WELCOME_MESSAGE,
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [isOpen, isSubmitting, messages]);

  const submitQuestion = async (nextQuestion = question) => {
    const message = nextQuestion.trim();
    if (!message || isSubmitting) return;

    setIsOpen(true);
    setQuestion('');
    setErrorMessage('');
    setMessages((current) => [
      ...current,
      {
        id: createMessageId('user'),
        role: 'user',
        type: 'text',
        content: message,
      },
    ]);
    setIsSubmitting(true);

    try {
      const plan = await assistantService.createExecutionPlan({
        message,
        context: assistantService.buildDefaultContext(),
      });

      setMessages((current) => [
        ...current,
        {
          id: createMessageId('assistant'),
          role: 'assistant',
          type: 'analysis',
          content: plan.route.summary || '已完成初步分析，请查看推荐动作。',
          prompt: message,
          plan,
        },
      ]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '暂时无法生成分析，请稍后重试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submitQuestion();
    }
  };

  return (
    <aside className={`home-consultation ${isOpen ? 'is-open' : ''}`} aria-label="AI 咨询助手">
      {isOpen && (
        <section
          id="home-consultation-panel"
          className="home-consultation-panel"
          aria-live="polite"
        >
          <header className="home-consultation-header">
            <div>
              <span className="home-consultation-eyebrow">AI CONSULTATION</span>
              <h2>材料咨询小助手</h2>
            </div>
            <button
              className="home-consultation-close"
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="收起咨询窗口"
            >
              ×
            </button>
          </header>

          <div className="home-consultation-messages" ref={messageListRef}>
            {messages.map((message) => (
              <article
                className={`consultation-message consultation-message-${message.role}`}
                key={message.id}
              >
                {message.role === 'assistant' && <span className="consultation-avatar">AI</span>}
                <div className="consultation-message-content">
                  {message.type === 'analysis' ? (
                    <>
                      <span className="consultation-message-label">分析结论</span>
                      <p>{message.content}</p>
                      <div className="consultation-analysis-details">
                        <div>
                          <strong>识别任务</strong>
                          <span>{message.plan.route.intent}</span>
                        </div>
                        <div>
                          <strong>推荐能力</strong>
                          <span>{formatCapabilities(message.plan)}</span>
                        </div>
                        {message.plan.route.needsClarification && message.plan.route.clarificationQuestion && (
                          <div>
                            <strong>建议补充</strong>
                            <span>{message.plan.route.clarificationQuestion}</span>
                          </div>
                        )}
                      </div>
                      <Link
                        className="consultation-detail-link"
                        to={`/assistant?message=${encodeURIComponent(message.prompt)}`}
                        onClick={() => setIsOpen(false)}                      >
                        查看完整分析 →
                      </Link>
                    </>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </article>
            ))}

            {isSubmitting && (
              <article className="consultation-message consultation-message-assistant">
                <span className="consultation-avatar">AI</span>
                <div className="consultation-message-content consultation-thinking">
                  正在识别问题并生成分析<span aria-hidden="true">···</span>
                </div>
              </article>
            )}
          </div>

          {messages.length === 1 && (
            <div className="home-consultation-suggestions">
              <span>你可以这样问</span>
              {SUGGESTED_QUESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void submitQuestion(suggestion)}
                  disabled={isSubmitting}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {errorMessage && <p className="consultation-error">{errorMessage}</p>}

          <div className="home-consultation-input">
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入材料、零件或性能问题…"
              rows={2}
              disabled={isSubmitting}
              aria-label="咨询问题"
            />
            <button
              type="button"
              onClick={() => void submitQuestion()}
              disabled={!question.trim() || isSubmitting}
              aria-label="发送问题"
            >
              ↑
            </button>
          </div>
          <p className="home-consultation-hint">Enter 发送 · Shift + Enter 换行</p>
        </section>
      )}

      <button
        className="home-consultation-trigger"
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="home-consultation-panel"
      >
        <span className="home-consultation-trigger-icon">✦</span>
        <span>{isOpen ? '收起咨询' : '在线咨询'}</span>
      </button>
    </aside>
  );
}
