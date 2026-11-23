# Published MaxDiff results, reconstructed in R for the public research wiki.
# Source: ../pages/009.html, "Ranked Motivations – Numeric Contrast".
# Run from the repository root: Rscript research-hub/media/maxdiff-published-charts.R
# Requires the svglite package: install.packages("svglite")
# These are descriptive, normalized relative importance indices, not percentages
# of respondents. This script does not re-estimate the respondent-level model,
# infer segment differences, or invent confidence intervals from aggregate scores.
args <- commandArgs(trailingOnly = FALSE)
script <- sub('^--file=', '', args[grepl('^--file=', args)])
folder <- dirname(normalizePath(script))
d <- read.csv(file.path(folder, 'maxdiff-published-results.csv'), check.names = FALSE)
stopifnot(nrow(d) == 15, all(abs((d$prospects - d$donors) - d$difference) < .11))
d$label <- c('Where my money goes', 'Tangible impact', 'Faith alignment',
 'Specific project or child', 'Urgency', 'Choice of donation amount',
 'Trust in fund use', 'Local community connection', 'Emotional story or imagery',
 'Simple and quick process', 'Impact updates', 'One time giving option',
 'Meaningful thanks', 'Social proof', 'Progress toward funding')
green <- '#164B39'; orange <- '#B2492E'; ink <- '#1B2823'; muted <- '#53645B'
start <- function(name, title, subtitle) {
 svglite::svglite(file.path(folder, name), width = 12, height = 8.5, bg = 'white')
 par(mar = c(4.5, 14, 5.4, 2.5), mgp = c(2.6, .6, 0), las = 1,
     col.axis = muted, col.lab = ink, fg = ink, cex = .94)
}
finish <- function(title, subtitle) {
 title(main = title, line = 3, adj = 0, cex.main = 1.35, col.main = ink)
 mtext(subtitle, side = 3, line = 1.35, adj = 0, col = muted, cex = .85)
 dev.off()
}
# 1. Ranked normalized prospect indices, all 15 published items.
x <- d[order(d$prospects), ]
start('maxdiff-prospect-ranking.svg')
b <- barplot(x$prospects, names.arg = x$label, horiz = TRUE, col = green,
 border = NA, xlim = c(0, 112), xlab = 'Normalized relative importance index')
abline(v = seq(0, 100, 25), col = '#E7ECE5', lwd = .7)
text(x$prospects + 2, b, sprintf('%.1f', x$prospects), pos = 4, cex = .85, col = ink)
finish('What prospects prioritize', 'Published aggregate results. Highest indexed item = 100; these are not respondent percentages.')
# 2. Same published items in two cohorts. Separate normalization limits direct comparison.
start('maxdiff-cohort-comparison.svg')
y <- seq_len(nrow(x))
plot(NA, xlim = c(-2, 110), ylim = c(.3, 16.4), yaxt = 'n', bty = 'n',
 xlab = 'Normalized relative importance index', ylab = '')
abline(v = seq(0, 100, 25), col = '#E7ECE5')
axis(2, at = y, labels = x$label, tick = FALSE)
segments(x$donors, y, x$prospects, y, col = '#A7B4AC', lwd = 2)
points(x$donors, y, pch = 16, cex = 1.1, col = green)
points(x$prospects, y, pch = 17, cex = 1.1, col = orange)
legend('topleft', legend = c('Donors', 'Prospects'), col = c(green, orange), pch = c(16,17),
 bty = 'n', horiz = TRUE, cex = .9)
finish('Donors and prospects: shared and different priorities', 'Cohorts normalized separately. Descriptive comparison, without inferential error bars.')
# 3. Difference in published indices, not a causal effect or standardized effect size.
x <- d[order(d$difference), ]
start('maxdiff-index-differences.svg')
b <- barplot(x$difference, names.arg = x$label, horiz = TRUE,
 col = ifelse(x$difference >= 0, orange, green), border = NA,
 xlim = c(-23, 21), xlab = 'Index point difference: prospects minus donors')
abline(v = 0, col = muted, lwd = 1)
text(x$difference + ifelse(x$difference >= 0, 1, -1), b,
 sprintf('%+.1f', x$difference), pos = ifelse(x$difference >= 0, 4, 2), cex = .85, col = ink)
finish('Where relative priorities diverge', 'Descriptive index point differences. This is not percentage point uplift or statistical significance.')
