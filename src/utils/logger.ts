/**
 * Utilitário para logs amigáveis com emojis
 */

// Tipos de log
type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'debug';

// Emojis para cada tipo de log
const emojis = {
  info: '💡',
  success: '✅',
  warn: '⚠️',
  error: '❌',
  debug: '🔍',
  server: '🚀',
  database: '🗄️',
  user: '👤',
  auth: '🔐',
  escola: '🏫',
  pedido: '📦',
  estoque: '📊',
  fornecedor: '🏭',
  route: '🛣️',
  controller: '🎮',
  service: '⚙️',
  model: '💾',
};

// Cores ANSI para o terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Função principal de log
export const log = (
  level: LogLevel,
  message: string,
  context?: string,
  data?: any
): void => {
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const emoji = context ? (emojis[context as keyof typeof emojis] || '📝') : emojis[level];
  let colorCode = '';

  // Seleciona a cor com base no nível do log
  switch (level) {
    case 'info':
      colorCode = colors.blue;
      break;
    case 'success':
      colorCode = colors.green;
      break;
    case 'warn':
      colorCode = colors.yellow;
      break;
    case 'error':
      colorCode = colors.red;
      break;
    case 'debug':
      colorCode = colors.magenta;
      break;
    default:
      colorCode = colors.white;
  }

  // Formata a mensagem
  const contextStr = context ? ` [${context.toUpperCase()}]` : '';
  let logMessage = `${colorCode}${timestamp} ${emoji}${contextStr} ${message}${colors.reset}`;

  console.log(logMessage);

  // Se houver dados extras, exibe-os formatados
  if (data) {
    const dataStr = typeof data === 'object'
      ? JSON.stringify(data, null, 2)
      : data.toString();
    console.log(`${colors.dim}${dataStr}${colors.reset}`);
  }
};

// Funções específicas para cada nível de log
export const logInfo = (message: string, context?: string, data?: any): void =>
  log('info', message, context, data);

export const logSuccess = (message: string, context?: string, data?: any): void =>
  log('success', message, context, data);

export const logWarning = (message: string, context?: string, data?: any): void =>
  log('warn', message, context, data);

export const logError = (message: string, context?: string, data?: any): void =>
  log('error', message, context, data);

export const logDebug = (message: string, context?: string, data?: any): void =>
  log('debug', message, context, data);

// Exportação por padrão
export default {
  log,
  info: logInfo,
  success: logSuccess,
  warning: logWarning,
  error: logError,
  debug: logDebug,
};
