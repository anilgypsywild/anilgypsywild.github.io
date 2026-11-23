# Reproduce visuals from public research summaries, without synthesizing participants.
# Sources: pages/043.html and pages/044.html. Requires svglite.
a <- commandArgs(FALSE);f <- sub('^--file=','',a[grepl('^--file=',a)]);out <- dirname(normalizePath(f))
ink <- '#1B2823';green <- '#164B39';orange <- '#B2492E';muted <- '#53645B'
# Reported co-groupings are qualitative relationships, not measured linkage heights.
pairs <- list(c('3D printing skills lab','Barber skills training'),c('Sewing and knitting workshop','Weaving skills center'),c('Preschool learning center','Literacy program'),c('Classroom renovation','School security access'),c('Cafeterias and restrooms','Classroom renovation'),c('Safe recreation area','Safe playground'))
svglite::svglite(file.path(out,'card-sort-reported-groups.svg'),width=13,height=7.5,pointsize=14,bg='white')
par(mar=c(1,1,3,1),xpd=NA);plot.new();plot.window(xlim=c(0,10),ylim=c(0,17))
labels <- c('Technical skills','Textile skills','Learning foundations','School access','School facilities','Safe play')
ytop <- c(15.2,12.7,10.2,7.7,5.2,2.7)
for(i in seq_along(pairs)){
 ys <- seq(ytop[i],by=-.83,length.out=length(pairs[[i]]));mid <- mean(ys)
 segments(3.8,min(ys),3.8,max(ys),col=green,lwd=2)
 segments(2.8,mid,3.8,mid,col=green,lwd=2)
 segments(3.8,ys,4.4,ys,col=green,lwd=2)
 text(2.55,mid,labels[i],adj=1,col=ink,font=2,cex=.95)
 text(4.6,ys,pairs[[i]],adj=0,col=ink,cex=.95)
}
title('Card pairings reported across the open sort',adj=0,line=2.1,col.main=ink,cex.main=1.18)
mtext('23 participants. Schematic relationships only. Branch lengths do not encode similarity or clustering distance.',side=3,line=.4,adj=0,col=muted,cex=.82)
dev.off()
# Exact reported navigation counts; multi-select options are not mutually exclusive.
d <- data.frame(option=c('Use filters or tags','Follow recommendations','Navigation menus','Search'),count=c(8,9,9,11))
write.csv(d,file.path(out,'card-sort-navigation-counts.csv'),row.names=FALSE)
svglite::svglite(file.path(out,'card-sort-navigation-preferences.svg'),width=12,height=5,pointsize=14,bg='white')
par(mar=c(4,13,4,2),las=1);b <- barplot(d$count,names.arg=d$option,horiz=TRUE,col=green,border=NA,xlim=c(0,14),xlab='Participants selecting the option')
text(d$count+.3,b,d$count,pos=4,col=ink)
title('Donors wanted several ways to find causes',adj=0,col.main=ink,cex.main=1.15)
mtext('23 participants. Multiple selections allowed. Counts are not mutually exclusive.',side=3,line=.6,adj=0,col=muted,cex=.85);dev.off()
# Severity matrix transcribes the five issues in the published priority table.
cats <- c('Water','Education','Health','Income\ngeneration','Infrastructure','Technology')
issues <- c('Outcome and means mismatch','Unclear category boundaries','No cross category affordances','Overloaded technology category','Water subgroups missing')
m <- matrix(0,nrow=5,ncol=6,dimnames=list(issues,gsub('\n',' ',cats)))
m[1,4:6] <- 3;m[2,] <- 2;m[3,] <- 2;m[4,6] <- 3;m[5,1] <- 1
write.csv(data.frame(issue=rownames(m),m,check.names=FALSE),file.path(out,'heuristic-priority-severity.csv'),row.names=FALSE)
svglite::svglite(file.path(out,'heuristic-category-heatmap.svg'),width=14,height=6.5,pointsize=14,bg='white')
par(mar=c(4.2,17,5,2),xpd=NA);plot.new();plot.window(xlim=c(.5,6.5),ylim=c(.5,5.5))
colors <- c('#EFF2EC','#DCEADE','#F5D6AC','#B2492E');labs <- c('Not flagged','Low','Medium','High')
for(r in 1:5)for(c in 1:6){y<-6-r;rect(c-.49,y-.48,c+.49,y+.48,col=colors[m[r,c]+1],border='white');text(c,y,labs[m[r,c]+1],cex=.75,col=if(m[r,c]==3)'white' else ink)}
axis(1,at=1:6,labels=cats,tick=FALSE,line=.4,cex.axis=.83,col.axis=ink)
axis(2,at=5:1,labels=issues,las=1,tick=FALSE,cex.axis=.9,col.axis=ink)
title('Heuristic priorities by Causes category',adj=0,col.main=ink,cex.main=1.15)
mtext('Qualitative severity from the published review. Unflagged cells do not imply a pass or measured absence of problems.',side=3,line=1.3,adj=0,col=muted,cex=.78)
dev.off()
