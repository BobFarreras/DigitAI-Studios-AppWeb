# src/app

Responsabilitat:
- Definir rutes, layouts i composició de pàgines.
- Orquestrar components i server actions sense lògica de domini pesada.

Regles:
- No queries de negoci directes des de UI.
- No lògica complexa: delegar a `actions/services`.
- Respectar i18n amb `/[locale]/...`.
