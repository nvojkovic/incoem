---
  pdf_document: null
  mainfont: serif
  papersize: a4
  geometry: margin=2cm
  output: pdf_document
---

# Social security notes

retirement age (RA) refers to input in income mapper

for all calculations involving birth dates, use the day before, so if 1st of months, use previous month, if January 1st, use previous year

first, calculate NRA/FRA [1] based on birth date

when you retire, SS income is a maximum of

- own benefits [5]
  - can't be claimed before 62
  - if before FRA, for every month between RA and FRA, PIA decreased 5/9% for first 36 months, and by 5/12% for the rest
  - if after FRA, for every month after FRA, PIA increased 2/3% (they have a table for this too, but it's 2/3% for everyone under 81, so no need to calculate)
    - stops increasing at age 70
- if spouse is alive and retired, spousal benefits [2]
  - similar to own, can't be claimed before 62
  - the base is 50% of spouse's retirement income
  - if before FRA, base decreased by 25/36% up to 36 months, and by 5/12% after that
  - no increases for waiting past FRA, capped at 50% of spouse's PIA
- survivor benefits

  - if spouse retired before death, base is what they were receiving at the time they died, if not, base is amount at FRA
  - can claim when at least 60
  - unlike spousal doesn't affect your own retirement date/reduction, can be claimed independently, so another input on calculator page "X starts drawing survivor SS"
  - reduced by age-dependent % when claimed before FRA [6]
  - no delayed credits

- from result above, apply work reduction [3]

  - if past FRA, no reduction
  - if reaching FRA that year, for every $3 of income above $59,520, SS reduced by $1
  - if below FRA, for every $2 of income above $22,320, SS reduced by $1
  - only employment income is counted, no pensions, annuities etc
    - but self-employment also included, how does that work in our context? [4]

- all amounts adjusted by COLA and inflation

## For later:

- PIA calculator with inputs for all years of income. could be a cool integration with the calculator by including projected Employment Income into PIA calculations?
- add the childcare, disability etc. checkboxes that change eligibility dates and amounts
- the employment limits change annually, need a way to update that in-app

## References

[1] https://www.ssa.gov/oact/progdata/nra.html

[2] https://www.ssa.gov/OACT/quickcalc/spouse.html

[3] https://www.ssa.gov/pubs/EN-05-10069.pdf

[4] https://www.ssa.gov/pubs/EN-05-10063.pdf

[5] https://www.ssa.gov/oact/quickcalc/early_late.html#drcTable

[6] https://www.ssa.gov/benefits/survivors/survivorchartred.html

<!-- Markdeep: --><style class="fallback">body{visibility:hidden;white-space:pre;font-family:monospace}</style><script src="markdeep.min.js" charset="utf-8"></script><script src="https://morgan3d.github.io/markdeep/latest/markdeep.min.js" charset="utf-8"></script><script>window.alreadyProcessedMarkdeep||(document.body.style.visibility="visible")</script>
