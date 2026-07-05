# Fab Price vs Fixer Price

Comparing profit when **fabricating** an item versus **sourcing** it through a Fixer.

## Rules Applied

- **Making Cost** for a tier = price of the **preceding** tier.
- **Cheap (10eb)** has no preceding tier; per RAW, fabricating a Cheap item costs **5eb**.
- **Tiers at 10,000eb or above:** Making Cost = **that tier's own price ÷ 2**.
- **Fab Price** = Making Cost (what the fab charges the fixer).
- **Fixer Price** = tier price (what the fixer charges the customer).
- The fixer applies a **15% discount** to the customer → customer pays **tier × 0.85**.
- **Fab Profit** = (Fixer Price × 0.85) − Making Cost.
- **Fixer Profit** = (tier × 0.85) − (tier × 0.80) = **tier × 0.05**.

## Customer Sale Price

Every tier sells to the customer at **15% off** list:

| Tier (eb) | Customer Pays |
|-----------|---------------|
| 10 | 8.50eb |
| 20 | 17.00eb |
| 50 | 42.50eb |
| 100 | 85.00eb |
| 500 | 425.00eb |
| 1,000 | 850.00eb |
| 5,000 | 4,250.00eb |
| 10,000 | 8,500.00eb |

## Fabricator Route

| Tier (eb) | Making Cost | Fab Profit | Days | Profit/Day |
|-----------|-------------|------------|------|------------|
| 10 | 5eb (Cheap min) | 3.50eb | 0.1 | 35.00eb |
| 20 | 10eb | 7.00eb | 0.1 | 70.00eb |
| 50 | 20eb | 22.50eb | 0.5 | 45.00eb |
| 100 | 50eb | 35.00eb | 1 | 35.00eb |
| 500 | 100eb | 325.00eb | 7 | 46.43eb |
| 1,000 | 500eb | 350.00eb | 14 | 25.00eb |
| 5,000 | 1,000eb | 3,250.00eb | 28 | 116.07eb |
| 10,000 | 5,000eb (½ of tier) | 3,500.00eb | 28 | 125.00eb |

## Fixer Route

Fixer acquires at **20% off** list (tier × 0.80), sells at customer price (tier × 0.85).

| Tier (eb) | Acquisition Cost | Fixer Profit | Days | Profit/Day |
|-----------|------------------|--------------|------|------------|
| 10 | 8.00eb | 0.50eb | 1 | 0.50eb |
| 20 | 16.00eb | 1.00eb | 1 | 1.00eb |
| 50 | 40.00eb | 2.50eb | 1 | 2.50eb |
| 100 | 80.00eb | 5.00eb | 1 | 5.00eb |
| 500 | 400.00eb | 25.00eb | 1 | 25.00eb |
| 1,000 | 800.00eb | 50.00eb | 1 | 50.00eb |
| 5,000 | 4,000.00eb | 250.00eb | 1 | 250.00eb |
| 10,000 | 8,000.00eb | 500.00eb | 1 | 500.00eb |

## Tiers Above 10,000eb

- **Making Cost** = half of that tier's own price.
- **Fab profit** = (tier × 0.85) − (tier ÷ 2)
- **Fixer profit** = tier × 0.05 (always 1 day)
