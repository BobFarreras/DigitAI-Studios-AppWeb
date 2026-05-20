# Skill: n8n Rules

## Quan carregar
Qualsevol task que impliqui automacions, webhooks, integracions externes, o fluxos de treball amb n8n.

## Arquitectura n8n
- n8n s'encarrega d'automatitzacions: bots RRSS, notificacions, sync de dades
- El projecte no conté codi n8n directament
- El projecte PROVEEIX endpoints que n8n consumeix

## Patrons d'Integració

### Webhooks Entrants (n8n → App)
- Crear API routes a `src/app/api/`
- Validar ALWAYS amb Zod el payload
- Authenticar webhook calls (API key o secret compartit)
- Retorn 200 ràpid, processar asíncronament si cal

### Webhooks Sortints (App → n8n)
- Usar adapters a `src/adapters/`
- Interfícies a `src/adapters/interfaces/`
- Mai hardcoded URLs — usar env vars

### Flux de Dades
```
n8n → API Route (src/app/api/) → Service → Repository → DB
App → Adapter (src/adapters/) → n8n webhook
```

## Regles
- Validació Zod OBLIGATÒRIA en tots els endpoints de webhook
- Autenticació de webhooks amb secret compartit
- Rate limiting en endpoints públics
- Logging d'errors però MAI log de secrets
- Retries amb backoff per fallades d'API

## Errors a Evitar
- ❌ Trustar webhooks sense autenticació
- ❌ Logejar secrets o tokens
- ❌ Hardcodejar URLs de n8n
- ❌ Processament síncron en webhooks pesats
- ❌ No validar payload amb Zod

## Checklist
1. Webhook té autenticació?
2. Payload es valida amb Zod?
3. URLs van per env vars?
4. Errors es loguegen sense secrets?