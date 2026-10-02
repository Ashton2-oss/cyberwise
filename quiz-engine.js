(function () {
  const STYLE_ID = 'cyberwise-quiz-style';

  function styleQuiz() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .quiz-shell {
        max-width: 1100px;
        margin: 36px auto 52px;
        padding: 0 20px;
      }
      .quiz-card {
        border: 1px solid var(--border, rgba(20, 20, 43, 0.08));
        border-radius: 22px;
        background: var(--surface, #ffffff);
        box-shadow: 0 14px 36px rgba(20, 20, 43, 0.08);
        padding: 28px 24px 20px;
      }
      .quiz-card h3 {
        margin: 0 0 12px;
        font-size: clamp(1.3rem, 2vw, 1.8rem);
        letter-spacing: -0.03em;
        color: var(--ink, #1a1a2e);
      }
      .quiz-score-pill {
        margin: 0 0 18px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 999px;
        background: var(--lavender-soft, rgba(167, 139, 250, 0.12));
        color: var(--ink-2, #4b4b6b);
        font-size: 0.82rem;
        font-weight: 600;
      }
      .quiz-form {
        display: grid;
        gap: 18px;
      }
      .quiz-question {
        border: 1px solid var(--border, rgba(20, 20, 43, 0.08));
        border-radius: 16px;
        background: var(--surface-2, #fafafe);
        padding: 18px 16px;
      }
      .quiz-question p {
        margin: 0 0 12px;
        color: var(--ink, #1a1a2e);
        font-weight: 600;
        line-height: 1.5;
      }
      .quiz-question label {
        display: block;
        margin: 8px 0;
        color: var(--ink-2, #4b4b6b);
        cursor: pointer;
        line-height: 1.5;
      }
      .quiz-question input {
        margin-right: 10px;
        accent-color: var(--lavender-2, #8b5cf6);
      }
      .quiz-button {
        border: none;
        border-radius: 12px;
        background: linear-gradient(135deg, var(--lavender-2, #8b5cf6), var(--sky, #60a5fa));
        color: #fff;
        font: inherit;
        font-weight: 700;
        padding: 12px 18px;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 10px 20px rgba(139, 92, 246, 0.22);
      }
      .quiz-button:hover {
        transform: translateY(-1px);
      }
      .quiz-result {
        margin-top: 18px;
        padding: 12px 14px;
        border-radius: 12px;
        background: rgba(139, 92, 246, 0.08);
        color: var(--ink, #1a1a2e);
        line-height: 1.6;
      }
      @media (max-width: 640px) {
        .quiz-card {
          padding: 22px 16px 18px;
        }
        .quiz-question {
          padding: 14px 12px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function normalizeTopic(topicName) {
    const raw = (topicName || 'guide').toString();
    const lookup = {
      recover: 'recovery',
      recovery: 'recovery',
      guide: 'guide',
      screen6: 'screen6',
      data_breach: 'data_breach'
    };
    return lookup[raw] || raw.replace(/[^a-zA-Z0-9_-]/g, '');
  }

  window.loadQuiz = function (topicName) {
    styleQuiz();

    const safeTopic = normalizeTopic(topicName);
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer || !window.quizData || !window.quizData[safeTopic]) {
      return;
    }

    const questions = window.quizData[safeTopic];
    const savedScore = localStorage.getItem('cyberwise_quiz_' + safeTopic);

    let html = '<div class="quiz-card">';
    html += '<h3>Test your knowledge</h3>';
    if (savedScore !== null) {
      html += '<p class="quiz-score-pill">You previously scored ' + savedScore + ' / ' + questions.length + '. Retake to improve.</p>';
    }
    html += '<form id="quizForm" class="quiz-form">';

    questions.forEach(function (q, index) {
      html += '<div class="quiz-question">';
      html += '<p><strong>' + (index + 1) + '. ' + q.question + '</strong></p>';
      q.options.forEach(function (opt, optionIndex) {
        html += '<label><input type="radio" name="q' + index + '" value="' + optionIndex + '"> ' + opt + '</label>';
      });
      html += '</div>';
    });

    html += '<button type="button" class="quiz-button" onclick="window.checkQuiz(\'' + safeTopic + '\', ' + questions.length + ')">Submit answers</button>';
    html += '</form>';
    html += '<div id="quiz-result" class="quiz-result"></div>';
    html += '</div>';

    quizContainer.innerHTML = html;
  };

  window.checkQuiz = function (topicName, totalQuestions) {
    const safeTopic = normalizeTopic(topicName);
    const questions = window.quizData && window.quizData[safeTopic];
    const form = document.getElementById('quizForm');
    if (!form || !questions) {
      return;
    }

    let score = 0;
    questions.forEach(function (q, index) {
      const selected = form.querySelector('input[name="q' + index + '"]:checked');
      if (selected && Number(selected.value) === q.correct) {
        score += 1;
      }
    });

    localStorage.setItem('cyberwise_quiz_' + safeTopic, String(score));

    const resultBox = document.getElementById('quiz-result');
    if (!resultBox) {
      return;
    }

    let text = '<strong>You scored ' + score + ' out of ' + totalQuestions + '.</strong>';
    if (score === totalQuestions) {
      resultBox.style.color = '#16a34a';
      text += '<br>🎉 Perfect! You are CyberWise.';
    } else {
      resultBox.style.color = '#f59e0b';
      text += '<br>Review the material above and try again.';
    }

    resultBox.innerHTML = text;
  };

  window.addEventListener('DOMContentLoaded', function () {
    const bodyTopic = document.body && document.body.dataset && document.body.dataset.quiz;
    const fallback = (window.location.pathname.split('/').pop() || 'guide').replace('.html', '');
    const nextTopic = bodyTopic || fallback;
    if (window.loadQuiz) {
      window.loadQuiz(nextTopic);
    }
  });
})();
