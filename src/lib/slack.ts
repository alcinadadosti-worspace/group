import { WebClient } from '@slack/web-api'

const slackToken = process.env.SLACK_BOT_TOKEN
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Inicializa o cliente Slack apenas se o token estiver configurado
const slack = slackToken ? new WebClient(slackToken) : null

interface NotifyFeedbackParams {
  slackUserId: string
  managerName: string
  rating: number
  hasComment: boolean
}

export async function notifyNewFeedback({
  slackUserId,
  managerName,
  rating,
  hasComment,
}: NotifyFeedbackParams): Promise<boolean> {
  if (!slack) {
    console.warn('Slack não configurado - notificação ignorada')
    return false
  }

  try {
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)

    await slack.chat.postMessage({
      channel: slackUserId,
      text: `Novo feedback recebido!`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '📬 Novo Feedback Recebido!',
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Olá, *${managerName}*!\n\nVocê recebeu uma nova avaliação no FeedSyncs.`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Nota:*\n${stars} (${rating}/5)`,
            },
            {
              type: 'mrkdwn',
              text: `*Comentário:*\n${hasComment ? 'Sim (visualize no dashboard)' : 'Não incluído'}`,
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Ver no Dashboard',
                emoji: true,
              },
              url: `${appUrl}/dashboard`,
              style: 'primary',
            },
          ],
        },
      ],
    })

    return true
  } catch (error) {
    console.error('Erro ao enviar notificação Slack:', error)
    return false
  }
}

interface NotifyReportParams {
  category: string
  reportedManagerName?: string
}

export async function notifyNewReport({
  category,
  reportedManagerName,
}: NotifyReportParams): Promise<boolean> {
  if (!slack) {
    console.warn('Slack não configurado - notificação de ouvidoria ignorada')
    return false
  }

  // Aqui você pode configurar um canal específico para receber denúncias
  // Por exemplo: #ouvidoria ou um grupo de administradores
  const adminChannel = process.env.SLACK_ADMIN_CHANNEL

  if (!adminChannel) {
    console.warn('Canal de admin do Slack não configurado')
    return false
  }

  try {
    await slack.chat.postMessage({
      channel: adminChannel,
      text: 'Nova denúncia na Ouvidoria',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚨 Nova Denúncia na Ouvidoria',
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Categoria:*\n${category}`,
            },
            {
              type: 'mrkdwn',
              text: `*Relacionado a:*\n${reportedManagerName || 'Não especificado'}`,
            },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: 'Acesse o painel administrativo para mais detalhes.',
            },
          ],
        },
      ],
    })

    return true
  } catch (error) {
    console.error('Erro ao enviar notificação de ouvidoria:', error)
    return false
  }
}
