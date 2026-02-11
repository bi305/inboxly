import { WebhooksService } from '../src/modules/webhooks/webhooks.service'

describe('WebhooksService', () => {
  it('processes inbound messages', async () => {
    const prisma: any = {
      webhookEvent: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({})
      }
    }
    const whatsapp: any = {
      findConnectionByPhoneNumberId: jest.fn().mockResolvedValue({
        id: 'conn1',
        workspaceId: 'ws1',
        botId: 'bot1'
      })
    }
    const runtime: any = {
      processIncomingMessage: jest.fn().mockResolvedValue({ ok: true })
    }

    const service = new WebhooksService(prisma, whatsapp, runtime)

    await service.handleWhatsAppWebhook({
      entry: [
        {
          changes: [
            {
              value: {
                metadata: { phone_number_id: '123' },
                messages: [{ id: 'mid', from: '15550001111', text: { body: 'hi' } }]
              }
            }
          ]
        }
      ]
    })

    expect(runtime.processIncomingMessage).toHaveBeenCalled()
  })
})
