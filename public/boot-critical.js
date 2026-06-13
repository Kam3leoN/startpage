(function(){"use strict";/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z(t){return t<0?-1:t===0?0:1}function Z(t,e,r){return(1-r)*t+r*e}function wt(t,e,r){return r<t?t:r>e?e:r}function v(t,e,r){return r<t?t:r>e?e:r}function at(t){return t=t%360,t<0&&(t=t+360),t}function Tt(t,e){return at(e-t)<=180?1:-1}function It(t,e){return 180-Math.abs(Math.abs(t-e)-180)}function ot(t,e){const r=t[0]*e[0][0]+t[1]*e[0][1]+t[2]*e[0][2],n=t[0]*e[1][0]+t[1]*e[1][1]+t[2]*e[1][2],a=t[0]*e[2][0]+t[1]*e[2][1]+t[2]*e[2][2];return[r,n,a]}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ft=[[.41233895,.35762064,.18051042],[.2126,.7152,.0722],[.01932141,.11916382,.95034478]],At=[[3.2413774792388685,-1.5376652402851851,-.49885366846268053],[-.9691452513005321,1.8758853451067872,.04156585616912061],[.05562093689691305,-.20395524564742123,1.0571799111220335]],Bt=[95.047,100,108.883];function st(t,e,r){return(255<<24|(t&255)<<16|(e&255)<<8|r&255)>>>0}function pt(t){const e=$(t[0]),r=$(t[1]),n=$(t[2]);return st(e,r,n)}function gt(t){return t>>16&255}function yt(t){return t>>8&255}function bt(t){return t&255}function Lt(t,e,r){const n=At,a=n[0][0]*t+n[0][1]*e+n[0][2]*r,i=n[1][0]*t+n[1][1]*e+n[1][2]*r,o=n[2][0]*t+n[2][1]*e+n[2][2]*r,c=$(a),l=$(i),f=$(o);return st(c,l,f)}function Ot(t){const e=X(gt(t)),r=X(yt(t)),n=X(bt(t));return ot([e,r,n],Ft)}function xt(t){const e=J(t),r=$(e);return st(r,r,r)}function it(t){const e=Ot(t)[1];return 116*kt(e/100)-16}function J(t){return 100*Rt((t+16)/116)}function ct(t){return kt(t/100)*116-16}function X(t){const e=t/255;return e<=.040449936?e/12.92*100:Math.pow((e+.055)/1.055,2.4)*100}function $(t){const e=t/100;let r=0;return e<=.0031308?r=e*12.92:r=1.055*Math.pow(e,1/2.4)-.055,wt(0,255,Math.round(r*255))}function Et(){return Bt}function kt(t){const e=.008856451679035631,r=24389/27;return t>e?Math.pow(t,1/3):(r*t+16)/116}function Rt(t){const e=.008856451679035631,r=24389/27,n=t*t*t;return n>e?n:(116*t-16)/r}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q{static make(e=Et(),r=200/Math.PI*J(50)/100,n=50,a=2,i=!1){const o=e,c=o[0]*.401288+o[1]*.650173+o[2]*-.051461,l=o[0]*-.250268+o[1]*1.204414+o[2]*.045854,f=o[0]*-.002079+o[1]*.048952+o[2]*.953127,h=.8+a/10,p=h>=.9?Z(.59,.69,(h-.9)*10):Z(.525,.59,(h-.8)*10);let g=i?1:h*(1-1/3.6*Math.exp((-r-42)/92));g=g>1?1:g<0?0:g;const M=h,y=[g*(100/c)+1-g,g*(100/l)+1-g,g*(100/f)+1-g],b=1/(5*r+1),C=b*b*b*b,F=1-C,T=C*r+.1*F*F*Math.cbrt(5*r),P=J(n)/e[1],N=1.48+Math.sqrt(P),k=.725/Math.pow(P,.2),x=k,D=[Math.pow(T*y[0]*c/100,.42),Math.pow(T*y[1]*l/100,.42),Math.pow(T*y[2]*f/100,.42)],A=[400*D[0]/(D[0]+27.13),400*D[1]/(D[1]+27.13),400*D[2]/(D[2]+27.13)],R=(2*A[0]+A[1]+.05*A[2])*k;return new q(P,R,k,x,p,M,y,T,Math.pow(T,.25),N)}constructor(e,r,n,a,i,o,c,l,f,h){this.n=e,this.aw=r,this.nbb=n,this.ncb=a,this.c=i,this.nc=o,this.rgbD=c,this.fl=l,this.fLRoot=f,this.z=h}}q.DEFAULT=q.make();/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{constructor(e,r,n,a,i,o,c,l,f){this.hue=e,this.chroma=r,this.j=n,this.q=a,this.m=i,this.s=o,this.jstar=c,this.astar=l,this.bstar=f}distance(e){const r=this.jstar-e.jstar,n=this.astar-e.astar,a=this.bstar-e.bstar,i=Math.sqrt(r*r+n*n+a*a);return 1.41*Math.pow(i,.63)}static fromInt(e){return B.fromIntInViewingConditions(e,q.DEFAULT)}static fromIntInViewingConditions(e,r){const n=(e&16711680)>>16,a=(e&65280)>>8,i=e&255,o=X(n),c=X(a),l=X(i),f=.41233895*o+.35762064*c+.18051042*l,h=.2126*o+.7152*c+.0722*l,p=.01932141*o+.11916382*c+.95034478*l,g=.401288*f+.650173*h-.051461*p,M=-.250268*f+1.204414*h+.045854*p,y=-.002079*f+.048952*h+.953127*p,b=r.rgbD[0]*g,C=r.rgbD[1]*M,F=r.rgbD[2]*y,T=Math.pow(r.fl*Math.abs(b)/100,.42),P=Math.pow(r.fl*Math.abs(C)/100,.42),N=Math.pow(r.fl*Math.abs(F)/100,.42),k=z(b)*400*T/(T+27.13),x=z(C)*400*P/(P+27.13),D=z(F)*400*N/(N+27.13),A=(11*k+-12*x+D)/11,R=(k+x-2*D)/9,I=(20*k+20*x+21*D)/20,G=(40*k+20*x+D)/20,U=Math.atan2(R,A)*180/Math.PI,_=U<0?U+360:U>=360?U-360:U,tt=_*Math.PI/180,et=G*r.nbb,K=100*Math.pow(et/r.aw,r.c*r.z),rt=4/r.c*Math.sqrt(K/100)*(r.aw+4)*r.fLRoot,ht=_<20.14?_+360:_,ft=.25*(Math.cos(ht*Math.PI/180+2)+3.8),dt=5e4/13*ft*r.nc*r.ncb*Math.sqrt(A*A+R*R)/(I+.305),nt=Math.pow(dt,.9)*Math.pow(1.64-Math.pow(.29,r.n),.73),Mt=nt*Math.sqrt(K/100),Ct=Mt*r.fLRoot,$t=50*Math.sqrt(nt*r.c/(r.aw+4)),Xt=(1+100*.007)*K/(1+.007*K),Dt=1/.0228*Math.log(1+.0228*Ct),Wt=Dt*Math.cos(tt),Zt=Dt*Math.sin(tt);return new B(_,Mt,K,rt,Ct,$t,Xt,Wt,Zt)}static fromJch(e,r,n){return B.fromJchInViewingConditions(e,r,n,q.DEFAULT)}static fromJchInViewingConditions(e,r,n,a){const i=4/a.c*Math.sqrt(e/100)*(a.aw+4)*a.fLRoot,o=r*a.fLRoot,c=r/Math.sqrt(e/100),l=50*Math.sqrt(c*a.c/(a.aw+4)),f=n*Math.PI/180,h=(1+100*.007)*e/(1+.007*e),p=1/.0228*Math.log(1+.0228*o),g=p*Math.cos(f),M=p*Math.sin(f);return new B(n,r,e,i,o,l,h,g,M)}static fromUcs(e,r,n){return B.fromUcsInViewingConditions(e,r,n,q.DEFAULT)}static fromUcsInViewingConditions(e,r,n,a){const i=r,o=n,c=Math.sqrt(i*i+o*o),f=(Math.exp(c*.0228)-1)/.0228/a.fLRoot;let h=Math.atan2(o,i)*(180/Math.PI);h<0&&(h+=360);const p=e/(1-(e-100)*.007);return B.fromJchInViewingConditions(p,f,h,a)}toInt(){return this.viewed(q.DEFAULT)}viewed(e){const r=this.chroma===0||this.j===0?0:this.chroma/Math.sqrt(this.j/100),n=Math.pow(r/Math.pow(1.64-Math.pow(.29,e.n),.73),1/.9),a=this.hue*Math.PI/180,i=.25*(Math.cos(a+2)+3.8),o=e.aw*Math.pow(this.j/100,1/e.c/e.z),c=i*(5e4/13)*e.nc*e.ncb,l=o/e.nbb,f=Math.sin(a),h=Math.cos(a),p=23*(l+.305)*n/(23*c+11*n*h+108*n*f),g=p*h,M=p*f,y=(460*l+451*g+288*M)/1403,b=(460*l-891*g-261*M)/1403,C=(460*l-220*g-6300*M)/1403,F=Math.max(0,27.13*Math.abs(y)/(400-Math.abs(y))),T=z(y)*(100/e.fl)*Math.pow(F,1/.42),P=Math.max(0,27.13*Math.abs(b)/(400-Math.abs(b))),N=z(b)*(100/e.fl)*Math.pow(P,1/.42),k=Math.max(0,27.13*Math.abs(C)/(400-Math.abs(C))),x=z(C)*(100/e.fl)*Math.pow(k,1/.42),D=T/e.rgbD[0],A=N/e.rgbD[1],R=x/e.rgbD[2],I=1.86206786*D-1.01125463*A+.14918677*R,G=.38752654*D+.62144744*A-.00897398*R,H=-.0158415*D-.03412294*A+1.04996444*R;return Lt(I,G,H)}static fromXyzInViewingConditions(e,r,n,a){const i=.401288*e+.650173*r-.051461*n,o=-.250268*e+1.204414*r+.045854*n,c=-.002079*e+.048952*r+.953127*n,l=a.rgbD[0]*i,f=a.rgbD[1]*o,h=a.rgbD[2]*c,p=Math.pow(a.fl*Math.abs(l)/100,.42),g=Math.pow(a.fl*Math.abs(f)/100,.42),M=Math.pow(a.fl*Math.abs(h)/100,.42),y=z(l)*400*p/(p+27.13),b=z(f)*400*g/(g+27.13),C=z(h)*400*M/(M+27.13),F=(11*y+-12*b+C)/11,T=(y+b-2*C)/9,P=(20*y+20*b+21*C)/20,N=(40*y+20*b+C)/20,x=Math.atan2(T,F)*180/Math.PI,D=x<0?x+360:x>=360?x-360:x,A=D*Math.PI/180,R=N*a.nbb,I=100*Math.pow(R/a.aw,a.c*a.z),G=4/a.c*Math.sqrt(I/100)*(a.aw+4)*a.fLRoot,H=D<20.14?D+360:D,U=1/4*(Math.cos(H*Math.PI/180+2)+3.8),tt=5e4/13*U*a.nc*a.ncb*Math.sqrt(F*F+T*T)/(P+.305),et=Math.pow(tt,.9)*Math.pow(1.64-Math.pow(.29,a.n),.73),K=et*Math.sqrt(I/100),rt=K*a.fLRoot,ht=50*Math.sqrt(et*a.c/(a.aw+4)),ft=(1+100*.007)*I/(1+.007*I),mt=Math.log(1+.0228*rt)/.0228,dt=mt*Math.cos(A),nt=mt*Math.sin(A);return new B(D,K,I,G,rt,ht,ft,dt,nt)}xyzInViewingConditions(e){const r=this.chroma===0||this.j===0?0:this.chroma/Math.sqrt(this.j/100),n=Math.pow(r/Math.pow(1.64-Math.pow(.29,e.n),.73),1/.9),a=this.hue*Math.PI/180,i=.25*(Math.cos(a+2)+3.8),o=e.aw*Math.pow(this.j/100,1/e.c/e.z),c=i*(5e4/13)*e.nc*e.ncb,l=o/e.nbb,f=Math.sin(a),h=Math.cos(a),p=23*(l+.305)*n/(23*c+11*n*h+108*n*f),g=p*h,M=p*f,y=(460*l+451*g+288*M)/1403,b=(460*l-891*g-261*M)/1403,C=(460*l-220*g-6300*M)/1403,F=Math.max(0,27.13*Math.abs(y)/(400-Math.abs(y))),T=z(y)*(100/e.fl)*Math.pow(F,1/.42),P=Math.max(0,27.13*Math.abs(b)/(400-Math.abs(b))),N=z(b)*(100/e.fl)*Math.pow(P,1/.42),k=Math.max(0,27.13*Math.abs(C)/(400-Math.abs(C))),x=z(C)*(100/e.fl)*Math.pow(k,1/.42),D=T/e.rgbD[0],A=N/e.rgbD[1],R=x/e.rgbD[2],I=1.86206786*D-1.01125463*A+.14918677*R,G=.38752654*D+.62144744*A-.00897398*R,H=-.0158415*D-.03412294*A+1.04996444*R;return[I,G,H]}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class m{static sanitizeRadians(e){return(e+Math.PI*8)%(Math.PI*2)}static trueDelinearized(e){const r=e/100;let n=0;return r<=.0031308?n=r*12.92:n=1.055*Math.pow(r,1/2.4)-.055,n*255}static chromaticAdaptation(e){const r=Math.pow(Math.abs(e),.42);return z(e)*400*r/(r+27.13)}static hueOf(e){const r=ot(e,m.SCALED_DISCOUNT_FROM_LINRGB),n=m.chromaticAdaptation(r[0]),a=m.chromaticAdaptation(r[1]),i=m.chromaticAdaptation(r[2]),o=(11*n+-12*a+i)/11,c=(n+a-2*i)/9;return Math.atan2(c,o)}static areInCyclicOrder(e,r,n){const a=m.sanitizeRadians(r-e),i=m.sanitizeRadians(n-e);return a<i}static intercept(e,r,n){return(r-e)/(n-e)}static lerpPoint(e,r,n){return[e[0]+(n[0]-e[0])*r,e[1]+(n[1]-e[1])*r,e[2]+(n[2]-e[2])*r]}static setCoordinate(e,r,n,a){const i=m.intercept(e[a],r,n[a]);return m.lerpPoint(e,i,n)}static isBounded(e){return 0<=e&&e<=100}static nthVertex(e,r){const n=m.Y_FROM_LINRGB[0],a=m.Y_FROM_LINRGB[1],i=m.Y_FROM_LINRGB[2],o=r%4<=1?0:100,c=r%2===0?0:100;if(r<4){const l=o,f=c,h=(e-l*a-f*i)/n;return m.isBounded(h)?[h,l,f]:[-1,-1,-1]}else if(r<8){const l=o,f=c,h=(e-f*n-l*i)/a;return m.isBounded(h)?[f,h,l]:[-1,-1,-1]}else{const l=o,f=c,h=(e-l*n-f*a)/i;return m.isBounded(h)?[l,f,h]:[-1,-1,-1]}}static bisectToSegment(e,r){let n=[-1,-1,-1],a=n,i=0,o=0,c=!1,l=!0;for(let f=0;f<12;f++){const h=m.nthVertex(e,f);if(h[0]<0)continue;const p=m.hueOf(h);if(!c){n=h,a=h,i=p,o=p,c=!0;continue}(l||m.areInCyclicOrder(i,p,o))&&(l=!1,m.areInCyclicOrder(i,r,p)?(a=h,o=p):(n=h,i=p))}return[n,a]}static midpoint(e,r){return[(e[0]+r[0])/2,(e[1]+r[1])/2,(e[2]+r[2])/2]}static criticalPlaneBelow(e){return Math.floor(e-.5)}static criticalPlaneAbove(e){return Math.ceil(e-.5)}static bisectToLimit(e,r){const n=m.bisectToSegment(e,r);let a=n[0],i=m.hueOf(a),o=n[1];for(let c=0;c<3;c++)if(a[c]!==o[c]){let l=-1,f=255;a[c]<o[c]?(l=m.criticalPlaneBelow(m.trueDelinearized(a[c])),f=m.criticalPlaneAbove(m.trueDelinearized(o[c]))):(l=m.criticalPlaneAbove(m.trueDelinearized(a[c])),f=m.criticalPlaneBelow(m.trueDelinearized(o[c])));for(let h=0;h<8&&!(Math.abs(f-l)<=1);h++){const p=Math.floor((l+f)/2),g=m.CRITICAL_PLANES[p],M=m.setCoordinate(a,g,o,c),y=m.hueOf(M);m.areInCyclicOrder(i,r,y)?(o=M,f=p):(a=M,i=y,l=p)}}return m.midpoint(a,o)}static inverseChromaticAdaptation(e){const r=Math.abs(e),n=Math.max(0,27.13*r/(400-r));return z(e)*Math.pow(n,1/.42)}static findResultByJ(e,r,n){let a=Math.sqrt(n)*11;const i=q.DEFAULT,o=1/Math.pow(1.64-Math.pow(.29,i.n),.73),l=.25*(Math.cos(e+2)+3.8)*(5e4/13)*i.nc*i.ncb,f=Math.sin(e),h=Math.cos(e);for(let p=0;p<5;p++){const g=a/100,M=r===0||a===0?0:r/Math.sqrt(g),y=Math.pow(M*o,1/.9),C=i.aw*Math.pow(g,1/i.c/i.z)/i.nbb,F=23*(C+.305)*y/(23*l+11*y*h+108*y*f),T=F*h,P=F*f,N=(460*C+451*T+288*P)/1403,k=(460*C-891*T-261*P)/1403,x=(460*C-220*T-6300*P)/1403,D=m.inverseChromaticAdaptation(N),A=m.inverseChromaticAdaptation(k),R=m.inverseChromaticAdaptation(x),I=ot([D,A,R],m.LINRGB_FROM_SCALED_DISCOUNT);if(I[0]<0||I[1]<0||I[2]<0)return 0;const G=m.Y_FROM_LINRGB[0],H=m.Y_FROM_LINRGB[1],U=m.Y_FROM_LINRGB[2],_=G*I[0]+H*I[1]+U*I[2];if(_<=0)return 0;if(p===4||Math.abs(_-n)<.002)return I[0]>100.01||I[1]>100.01||I[2]>100.01?0:pt(I);a=a-(_-n)*a/(2*_)}return 0}static solveToInt(e,r,n){if(r<1e-4||n<1e-4||n>99.9999)return xt(n);e=at(e);const a=e/180*Math.PI,i=J(n),o=m.findResultByJ(a,r,i);if(o!==0)return o;const c=m.bisectToLimit(i,a);return pt(c)}static solveToCam(e,r,n){return B.fromInt(m.solveToInt(e,r,n))}}m.SCALED_DISCOUNT_FROM_LINRGB=[[.001200833568784504,.002389694492170889,.0002795742885861124],[.0005891086651375999,.0029785502573438758,.0003270666104008398],[.00010146692491640572,.0005364214359186694,.0032979401770712076]],m.LINRGB_FROM_SCALED_DISCOUNT=[[1373.2198709594231,-1100.4251190754821,-7.278681089101213],[-271.815969077903,559.6580465940733,-32.46047482791194],[1.9622899599665666,-57.173814538844006,308.7233197812385]],m.Y_FROM_LINRGB=[.2126,.7152,.0722],m.CRITICAL_PLANES=[.015176349177441876,.045529047532325624,.07588174588720938,.10623444424209313,.13658714259697685,.16693984095186062,.19729253930674434,.2276452376616281,.2579979360165119,.28835063437139563,.3188300904430532,.350925934958123,.3848314933096426,.42057480301049466,.458183274052838,.4976837250274023,.5391024159806381,.5824650784040898,.6277969426914107,.6751227633498623,.7244668422128921,.775853049866786,.829304845476233,.8848452951698498,.942497089126609,1.0022825574869039,1.0642236851973577,1.1283421258858297,1.1946592148522128,1.2631959812511864,1.3339731595349034,1.407011200216447,1.4823302800086415,1.5599503113873272,1.6398909516233677,1.7221716113234105,1.8068114625156377,1.8938294463134073,1.9832442801866852,2.075074464868551,2.1693382909216234,2.2660538449872063,2.36523901573795,2.4669114995532007,2.5710888059345764,2.6777882626779785,2.7870270208169257,2.898822059350997,3.0131901897720907,3.1301480604002863,3.2497121605402226,3.3718988244681087,3.4967242352587946,3.624204428461639,3.754355295633311,3.887192587735158,4.022731918402185,4.160988767090289,4.301978482107941,4.445716283538092,4.592217266055746,4.741496401646282,4.893568542229298,5.048448422192488,5.20615066083972,5.3666897647573375,5.5300801301023865,5.696336044816294,5.865471690767354,6.037501145825082,6.212438385869475,6.390297286737924,6.571091626112461,6.7548350853498045,6.941541251256611,7.131223617812143,7.323895587840543,7.5195704746346665,7.7182615035334345,7.919981813454504,8.124744458384042,8.332562408825165,8.543448553206703,8.757415699253682,8.974476575321063,9.194643831691977,9.417930041841839,9.644347703669503,9.873909240696694,10.106627003236781,10.342513269534024,10.58158024687427,10.8238400726681,11.069304815507364,11.317986476196008,11.569896988756009,11.825048221409341,12.083451977536606,12.345119996613247,12.610063955123938,12.878295467455942,13.149826086772048,13.42466730586372,13.702830557985108,13.984327217668513,14.269168601521828,14.55736596900856,14.848930523210871,15.143873411576273,15.44220572664832,15.743938506781891,16.04908273684337,16.35764934889634,16.66964922287304,16.985093187232053,17.30399201960269,17.62635644741625,17.95219714852476,18.281524751807332,18.614349837764564,18.95068293910138,19.290534541298456,19.633915083172692,19.98083495742689,20.331304511189067,20.685334046541502,21.042933821039977,21.404114048223256,21.76888489811322,22.137256497705877,22.50923893145328,22.884842241736916,23.264076429332462,23.6469514538663,24.033477234264016,24.42366364919083,24.817520537484558,25.21505769858089,25.61628489293138,26.021211842414342,26.429848230738664,26.842203703840827,27.258287870275353,27.678110301598522,28.10168053274597,28.529008062403893,28.96010235337422,29.39497283293396,29.83362889318845,30.276079891419332,30.722335150426627,31.172403958865512,31.62629557157785,32.08401920991837,32.54558406207592,33.010999283389665,33.4802739966603,33.953417292456834,34.430438229418264,34.911345834551085,35.39614910352207,35.88485700094671,36.37747846067349,36.87402238606382,37.37449765026789,37.87891309649659,38.38727753828926,38.89959975977785,39.41588851594697,39.93615253289054,40.460400508064545,40.98864111053629,41.520882981230194,42.05713473317016,42.597404951718396,43.141702194811224,43.6900349931913,44.24241185063697,44.798841244188324,45.35933162437017,45.92389141541209,46.49252901546552,47.065252796817916,47.64207110610409,48.22299226451468,48.808024568002054,49.3971762874833,49.9904556690408,50.587870934119984,51.189430279724725,51.79514187861014,52.40501387947288,53.0190544071392,53.637271562750364,54.259673423945976,54.88626804504493,55.517063457223934,56.15206766869424,56.79128866487574,57.43473440856916,58.08241284012621,58.734331877617365,59.39049941699807,60.05092333227251,60.715611475655585,61.38457167773311,62.057811747619894,62.7353394731159,63.417162620860914,64.10328893648692,64.79372614476921,65.48848194977529,66.18756403501224,66.89098006357258,67.59873767827808,68.31084450182222,69.02730813691093,69.74813616640164,70.47333615344107,71.20291564160104,71.93688215501312,72.67524319850172,73.41800625771542,74.16517879925733,74.9167682708136,75.67278210128072,76.43322770089146,77.1981124613393,77.96744375590167,78.74122893956174,79.51947534912904,80.30219030335869,81.08938110306934,81.88105503125999,82.67721935322541,83.4778813166706,84.28304815182372,85.09272707154808,85.90692527145302,86.72564993000343,87.54890820862819,88.3767072518277,89.2090541872801,90.04595612594655,90.88742016217518,91.73345337380438,92.58406282226491,93.43925555268066,94.29903859396902,95.16341895893969,96.03240364439274,96.9059996312159,97.78421388448044,98.6670533535366,99.55452497210776];/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{static from(e,r,n){return new L(m.solveToInt(e,r,n))}static fromInt(e){return new L(e)}toInt(){return this.argb}get hue(){return this.internalHue}set hue(e){this.setInternalState(m.solveToInt(e,this.internalChroma,this.internalTone))}get chroma(){return this.internalChroma}set chroma(e){this.setInternalState(m.solveToInt(this.internalHue,e,this.internalTone))}get tone(){return this.internalTone}set tone(e){this.setInternalState(m.solveToInt(this.internalHue,this.internalChroma,e))}constructor(e){this.argb=e;const r=B.fromInt(e);this.internalHue=r.hue,this.internalChroma=r.chroma,this.internalTone=it(e),this.argb=e}setInternalState(e){const r=B.fromInt(e);this.internalHue=r.hue,this.internalChroma=r.chroma,this.internalTone=it(e),this.argb=e}inViewingConditions(e){const n=B.fromInt(this.toInt()).xyzInViewingConditions(e),a=B.fromXyzInViewingConditions(n[0],n[1],n[2],q.make());return L.from(a.hue,a.chroma,ct(n[1]))}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ut{static harmonize(e,r){const n=L.fromInt(e),a=L.fromInt(r),i=It(n.hue,a.hue),o=Math.min(i*.5,15),c=at(n.hue+o*Tt(n.hue,a.hue));return L.from(c,n.chroma,n.tone).toInt()}static hctHue(e,r,n){const a=ut.cam16Ucs(e,r,n),i=B.fromInt(a),o=B.fromInt(e);return L.from(i.hue,o.chroma,it(e)).toInt()}static cam16Ucs(e,r,n){const a=B.fromInt(e),i=B.fromInt(r),o=a.jstar,c=a.astar,l=a.bstar,f=i.jstar,h=i.astar,p=i.bstar,g=o+(f-o)*n,M=c+(h-c)*n,y=l+(p-l)*n;return B.fromUcs(g,M,y).toInt()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O{static ratioOfTones(e,r){return e=v(0,100,e),r=v(0,100,r),O.ratioOfYs(J(e),J(r))}static ratioOfYs(e,r){const n=e>r?e:r,a=n===r?e:r;return(n+5)/(a+5)}static lighter(e,r){if(e<0||e>100)return-1;const n=J(e),a=r*(n+5)-5,i=O.ratioOfYs(a,n),o=Math.abs(i-r);if(i<r&&o>.04)return-1;const c=ct(a)+.4;return c<0||c>100?-1:c}static darker(e,r){if(e<0||e>100)return-1;const n=J(e),a=(n+5)/r-5,i=O.ratioOfYs(n,a),o=Math.abs(i-r);if(i<r&&o>.04)return-1;const c=ct(a)-.4;return c<0||c>100?-1:c}static lighterUnsafe(e,r){const n=O.lighter(e,r);return n<0?100:n}static darkerUnsafe(e,r){const n=O.darker(e,r);return n<0?0:n}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lt{static isDisliked(e){const r=Math.round(e.hue)>=90&&Math.round(e.hue)<=111,n=Math.round(e.chroma)>16,a=Math.round(e.tone)<65;return r&&n&&a}static fixIfDisliked(e){return lt.isDisliked(e)?L.from(e.hue,e.chroma,70):e}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u{static fromPalette(e){return new u(e.name??"",e.palette,e.tone,e.isBackground??!1,e.background,e.secondBackground,e.contrastCurve,e.toneDeltaPair)}constructor(e,r,n,a,i,o,c,l){if(this.name=e,this.palette=r,this.tone=n,this.isBackground=a,this.background=i,this.secondBackground=o,this.contrastCurve=c,this.toneDeltaPair=l,this.hctCache=new Map,!i&&o)throw new Error(`Color ${e} has secondBackgrounddefined, but background is not defined.`);if(!i&&c)throw new Error(`Color ${e} has contrastCurvedefined, but background is not defined.`);if(i&&!c)throw new Error(`Color ${e} has backgrounddefined, but contrastCurve is not defined.`)}getArgb(e){return this.getHct(e).toInt()}getHct(e){const r=this.hctCache.get(e);if(r!=null)return r;const n=this.getTone(e),a=this.palette(e).getHct(n);return this.hctCache.size>4&&this.hctCache.clear(),this.hctCache.set(e,a),a}getTone(e){const r=e.contrastLevel<0;if(this.toneDeltaPair){const n=this.toneDeltaPair(e),a=n.roleA,i=n.roleB,o=n.delta,c=n.polarity,l=n.stayTogether,h=this.background(e).getTone(e),p=c==="nearer"||c==="lighter"&&!e.isDark||c==="darker"&&e.isDark,g=p?a:i,M=p?i:a,y=this.name===g.name,b=e.isDark?1:-1,C=g.contrastCurve.get(e.contrastLevel),F=M.contrastCurve.get(e.contrastLevel),T=g.tone(e);let P=O.ratioOfTones(h,T)>=C?T:u.foregroundTone(h,C);const N=M.tone(e);let k=O.ratioOfTones(h,N)>=F?N:u.foregroundTone(h,F);return r&&(P=u.foregroundTone(h,C),k=u.foregroundTone(h,F)),(k-P)*b>=o||(k=v(0,100,P+o*b),(k-P)*b>=o||(P=v(0,100,k-o*b))),50<=P&&P<60?b>0?(P=60,k=Math.max(k,P+o*b)):(P=49,k=Math.min(k,P+o*b)):50<=k&&k<60&&(l?b>0?(P=60,k=Math.max(k,P+o*b)):(P=49,k=Math.min(k,P+o*b)):b>0?k=60:k=49),y?P:k}else{let n=this.tone(e);if(this.background==null)return n;const a=this.background(e).getTone(e),i=this.contrastCurve.get(e.contrastLevel);if(O.ratioOfTones(a,n)>=i||(n=u.foregroundTone(a,i)),r&&(n=u.foregroundTone(a,i)),this.isBackground&&50<=n&&n<60&&(O.ratioOfTones(49,a)>=i?n=49:n=60),this.secondBackground){const[o,c]=[this.background,this.secondBackground],[l,f]=[o(e).getTone(e),c(e).getTone(e)],[h,p]=[Math.max(l,f),Math.min(l,f)];if(O.ratioOfTones(h,n)>=i&&O.ratioOfTones(p,n)>=i)return n;const g=O.lighter(h,i),M=O.darker(p,i),y=[];return g!==-1&&y.push(g),M!==-1&&y.push(M),u.tonePrefersLightForeground(l)||u.tonePrefersLightForeground(f)?g<0?100:g:y.length===1?y[0]:M<0?0:M}return n}}static foregroundTone(e,r){const n=O.lighterUnsafe(e,r),a=O.darkerUnsafe(e,r),i=O.ratioOfTones(n,e),o=O.ratioOfTones(a,e);if(u.tonePrefersLightForeground(e)){const l=Math.abs(i-o)<.1&&i<r&&o<r;return i>=r||i>=o||l?n:a}else return o>=r||o>=i?a:n}static tonePrefersLightForeground(e){return Math.round(e)<60}static toneAllowsLightForeground(e){return Math.round(e)<=49}static enableLightForeground(e){return u.tonePrefersLightForeground(e)&&!u.toneAllowsLightForeground(e)?49:e}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S{static fromInt(e){const r=L.fromInt(e);return S.fromHct(r)}static fromHct(e){return new S(e.hue,e.chroma,e)}static fromHueAndChroma(e,r){const n=new St(e,r).create();return new S(e,r,n)}constructor(e,r,n){this.hue=e,this.chroma=r,this.keyColor=n,this.cache=new Map}tone(e){let r=this.cache.get(e);return r===void 0&&(r=L.from(this.hue,this.chroma,e).toInt(),this.cache.set(e,r)),r}getHct(e){return L.fromInt(this.tone(e))}}class St{constructor(e,r){this.hue=e,this.requestedChroma=r,this.chromaCache=new Map,this.maxChromaValue=200}create(){let a=0,i=100;for(;a<i;){const o=Math.floor((a+i)/2),c=this.maxChroma(o)<this.maxChroma(o+1);if(this.maxChroma(o)>=this.requestedChroma-.01)if(Math.abs(a-50)<Math.abs(i-50))i=o;else{if(a===o)return L.from(this.hue,this.requestedChroma,a);a=o}else c?a=o+1:i=o}return L.from(this.hue,this.requestedChroma,a)}maxChroma(e){if(this.chromaCache.has(e))return this.chromaCache.get(e);const r=L.from(this.hue,this.maxChromaValue,e).chroma;return this.chromaCache.set(e,r),r}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d{constructor(e,r,n,a){this.low=e,this.normal=r,this.medium=n,this.high=a}get(e){return e<=-1?this.low:e<0?Z(this.low,this.normal,(e- -1)/1):e<.5?Z(this.normal,this.medium,(e-0)/.5):e<1?Z(this.medium,this.high,(e-.5)/.5):this.high}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V{constructor(e,r,n,a,i){this.roleA=e,this.roleB=r,this.delta=n,this.polarity=a,this.stayTogether=i}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Q;(function(t){t[t.MONOCHROME=0]="MONOCHROME",t[t.NEUTRAL=1]="NEUTRAL",t[t.TONAL_SPOT=2]="TONAL_SPOT",t[t.VIBRANT=3]="VIBRANT",t[t.EXPRESSIVE=4]="EXPRESSIVE",t[t.FIDELITY=5]="FIDELITY",t[t.CONTENT=6]="CONTENT",t[t.RAINBOW=7]="RAINBOW",t[t.FRUIT_SALAD=8]="FRUIT_SALAD"})(Q||(Q={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W(t){return t.variant===Q.FIDELITY||t.variant===Q.CONTENT}function w(t){return t.variant===Q.MONOCHROME}function Nt(t,e,r,n){let a=r,i=L.from(t,e,r);if(i.chroma<e){let o=i.chroma;for(;i.chroma<e;){a+=n?-1:1;const c=L.from(t,e,a);if(o>c.chroma||Math.abs(c.chroma-e)<.4)break;const l=Math.abs(c.chroma-e),f=Math.abs(i.chroma-e);l<f&&(i=c),o=Math.max(o,c.chroma)}}return a}class s{static highestSurface(e){return e.isDark?s.surfaceBright:s.surfaceDim}}s.contentAccentToneDelta=15,s.primaryPaletteKeyColor=u.fromPalette({name:"primary_palette_key_color",palette:t=>t.primaryPalette,tone:t=>t.primaryPalette.keyColor.tone}),s.secondaryPaletteKeyColor=u.fromPalette({name:"secondary_palette_key_color",palette:t=>t.secondaryPalette,tone:t=>t.secondaryPalette.keyColor.tone}),s.tertiaryPaletteKeyColor=u.fromPalette({name:"tertiary_palette_key_color",palette:t=>t.tertiaryPalette,tone:t=>t.tertiaryPalette.keyColor.tone}),s.neutralPaletteKeyColor=u.fromPalette({name:"neutral_palette_key_color",palette:t=>t.neutralPalette,tone:t=>t.neutralPalette.keyColor.tone}),s.neutralVariantPaletteKeyColor=u.fromPalette({name:"neutral_variant_palette_key_color",palette:t=>t.neutralVariantPalette,tone:t=>t.neutralVariantPalette.keyColor.tone}),s.background=u.fromPalette({name:"background",palette:t=>t.neutralPalette,tone:t=>t.isDark?6:98,isBackground:!0}),s.onBackground=u.fromPalette({name:"on_background",palette:t=>t.neutralPalette,tone:t=>t.isDark?90:10,background:t=>s.background,contrastCurve:new d(3,3,4.5,7)}),s.surface=u.fromPalette({name:"surface",palette:t=>t.neutralPalette,tone:t=>t.isDark?6:98,isBackground:!0}),s.surfaceDim=u.fromPalette({name:"surface_dim",palette:t=>t.neutralPalette,tone:t=>t.isDark?6:new d(87,87,80,75).get(t.contrastLevel),isBackground:!0}),s.surfaceBright=u.fromPalette({name:"surface_bright",palette:t=>t.neutralPalette,tone:t=>t.isDark?new d(24,24,29,34).get(t.contrastLevel):98,isBackground:!0}),s.surfaceContainerLowest=u.fromPalette({name:"surface_container_lowest",palette:t=>t.neutralPalette,tone:t=>t.isDark?new d(4,4,2,0).get(t.contrastLevel):100,isBackground:!0}),s.surfaceContainerLow=u.fromPalette({name:"surface_container_low",palette:t=>t.neutralPalette,tone:t=>t.isDark?new d(10,10,11,12).get(t.contrastLevel):new d(96,96,96,95).get(t.contrastLevel),isBackground:!0}),s.surfaceContainer=u.fromPalette({name:"surface_container",palette:t=>t.neutralPalette,tone:t=>t.isDark?new d(12,12,16,20).get(t.contrastLevel):new d(94,94,92,90).get(t.contrastLevel),isBackground:!0}),s.surfaceContainerHigh=u.fromPalette({name:"surface_container_high",palette:t=>t.neutralPalette,tone:t=>t.isDark?new d(17,17,21,25).get(t.contrastLevel):new d(92,92,88,85).get(t.contrastLevel),isBackground:!0}),s.surfaceContainerHighest=u.fromPalette({name:"surface_container_highest",palette:t=>t.neutralPalette,tone:t=>t.isDark?new d(22,22,26,30).get(t.contrastLevel):new d(90,90,84,80).get(t.contrastLevel),isBackground:!0}),s.onSurface=u.fromPalette({name:"on_surface",palette:t=>t.neutralPalette,tone:t=>t.isDark?90:10,background:t=>s.highestSurface(t),contrastCurve:new d(4.5,7,11,21)}),s.surfaceVariant=u.fromPalette({name:"surface_variant",palette:t=>t.neutralVariantPalette,tone:t=>t.isDark?30:90,isBackground:!0}),s.onSurfaceVariant=u.fromPalette({name:"on_surface_variant",palette:t=>t.neutralVariantPalette,tone:t=>t.isDark?80:30,background:t=>s.highestSurface(t),contrastCurve:new d(3,4.5,7,11)}),s.inverseSurface=u.fromPalette({name:"inverse_surface",palette:t=>t.neutralPalette,tone:t=>t.isDark?90:20}),s.inverseOnSurface=u.fromPalette({name:"inverse_on_surface",palette:t=>t.neutralPalette,tone:t=>t.isDark?20:95,background:t=>s.inverseSurface,contrastCurve:new d(4.5,7,11,21)}),s.outline=u.fromPalette({name:"outline",palette:t=>t.neutralVariantPalette,tone:t=>t.isDark?60:50,background:t=>s.highestSurface(t),contrastCurve:new d(1.5,3,4.5,7)}),s.outlineVariant=u.fromPalette({name:"outline_variant",palette:t=>t.neutralVariantPalette,tone:t=>t.isDark?30:80,background:t=>s.highestSurface(t),contrastCurve:new d(1,1,3,4.5)}),s.shadow=u.fromPalette({name:"shadow",palette:t=>t.neutralPalette,tone:t=>0}),s.scrim=u.fromPalette({name:"scrim",palette:t=>t.neutralPalette,tone:t=>0}),s.surfaceTint=u.fromPalette({name:"surface_tint",palette:t=>t.primaryPalette,tone:t=>t.isDark?80:40,isBackground:!0}),s.primary=u.fromPalette({name:"primary",palette:t=>t.primaryPalette,tone:t=>w(t)?t.isDark?100:0:t.isDark?80:40,isBackground:!0,background:t=>s.highestSurface(t),contrastCurve:new d(3,4.5,7,7),toneDeltaPair:t=>new V(s.primaryContainer,s.primary,10,"nearer",!1)}),s.onPrimary=u.fromPalette({name:"on_primary",palette:t=>t.primaryPalette,tone:t=>w(t)?t.isDark?10:90:t.isDark?20:100,background:t=>s.primary,contrastCurve:new d(4.5,7,11,21)}),s.primaryContainer=u.fromPalette({name:"primary_container",palette:t=>t.primaryPalette,tone:t=>W(t)?t.sourceColorHct.tone:w(t)?t.isDark?85:25:t.isDark?30:90,isBackground:!0,background:t=>s.highestSurface(t),contrastCurve:new d(1,1,3,4.5),toneDeltaPair:t=>new V(s.primaryContainer,s.primary,10,"nearer",!1)}),s.onPrimaryContainer=u.fromPalette({name:"on_primary_container",palette:t=>t.primaryPalette,tone:t=>W(t)?u.foregroundTone(s.primaryContainer.tone(t),4.5):w(t)?t.isDark?0:100:t.isDark?90:30,background:t=>s.primaryContainer,contrastCurve:new d(3,4.5,7,11)}),s.inversePrimary=u.fromPalette({name:"inverse_primary",palette:t=>t.primaryPalette,tone:t=>t.isDark?40:80,background:t=>s.inverseSurface,contrastCurve:new d(3,4.5,7,7)}),s.secondary=u.fromPalette({name:"secondary",palette:t=>t.secondaryPalette,tone:t=>t.isDark?80:40,isBackground:!0,background:t=>s.highestSurface(t),contrastCurve:new d(3,4.5,7,7),toneDeltaPair:t=>new V(s.secondaryContainer,s.secondary,10,"nearer",!1)}),s.onSecondary=u.fromPalette({name:"on_secondary",palette:t=>t.secondaryPalette,tone:t=>w(t)?t.isDark?10:100:t.isDark?20:100,background:t=>s.secondary,contrastCurve:new d(4.5,7,11,21)}),s.secondaryContainer=u.fromPalette({name:"secondary_container",palette:t=>t.secondaryPalette,tone:t=>{const e=t.isDark?30:90;return w(t)?t.isDark?30:85:W(t)?Nt(t.secondaryPalette.hue,t.secondaryPalette.chroma,e,!t.isDark):e},isBackground:!0,background:t=>s.highestSurface(t),contrastCurve:new d(1,1,3,4.5),toneDeltaPair:t=>new V(s.secondaryContainer,s.secondary,10,"nearer",!1)}),s.onSecondaryContainer=u.fromPalette({name:"on_secondary_container",palette:t=>t.secondaryPalette,tone:t=>w(t)?t.isDark?90:10:W(t)?u.foregroundTone(s.secondaryContainer.tone(t),4.5):t.isDark?90:30,background:t=>s.secondaryContainer,contrastCurve:new d(3,4.5,7,11)}),s.tertiary=u.fromPalette({name:"tertiary",palette:t=>t.tertiaryPalette,tone:t=>w(t)?t.isDark?90:25:t.isDark?80:40,isBackground:!0,background:t=>s.highestSurface(t),contrastCurve:new d(3,4.5,7,7),toneDeltaPair:t=>new V(s.tertiaryContainer,s.tertiary,10,"nearer",!1)}),s.onTertiary=u.fromPalette({name:"on_tertiary",palette:t=>t.tertiaryPalette,tone:t=>w(t)?t.isDark?10:90:t.isDark?20:100,background:t=>s.tertiary,contrastCurve:new d(4.5,7,11,21)}),s.tertiaryContainer=u.fromPalette({name:"tertiary_container",palette:t=>t.tertiaryPalette,tone:t=>{if(w(t))return t.isDark?60:49;if(!W(t))return t.isDark?30:90;const e=t.tertiaryPalette.getHct(t.sourceColorHct.tone);return lt.fixIfDisliked(e).tone},isBackground:!0,background:t=>s.highestSurface(t),contrastCurve:new d(1,1,3,4.5),toneDeltaPair:t=>new V(s.tertiaryContainer,s.tertiary,10,"nearer",!1)}),s.onTertiaryContainer=u.fromPalette({name:"on_tertiary_container",palette:t=>t.tertiaryPalette,tone:t=>w(t)?t.isDark?0:100:W(t)?u.foregroundTone(s.tertiaryContainer.tone(t),4.5):t.isDark?90:30,background:t=>s.tertiaryContainer,contrastCurve:new d(3,4.5,7,11)}),s.error=u.fromPalette({name:"error",palette:t=>t.errorPalette,tone:t=>t.isDark?80:40,isBackground:!0,background:t=>s.highestSurface(t),contrastCurve:new d(3,4.5,7,7),toneDeltaPair:t=>new V(s.errorContainer,s.error,10,"nearer",!1)}),s.onError=u.fromPalette({name:"on_error",palette:t=>t.errorPalette,tone:t=>t.isDark?20:100,background:t=>s.error,contrastCurve:new d(4.5,7,11,21)}),s.errorContainer=u.fromPalette({name:"error_container",palette:t=>t.errorPalette,tone:t=>t.isDark?30:90,isBackground:!0,background:t=>s.highestSurface(t),contrastCurve:new d(1,1,3,4.5),toneDeltaPair:t=>new V(s.errorContainer,s.error,10,"nearer",!1)}),s.onErrorContainer=u.fromPalette({name:"on_error_container",palette:t=>t.errorPalette,tone:t=>w(t)?t.isDark?90:10:t.isDark?90:30,background:t=>s.errorContainer,contrastCurve:new d(3,4.5,7,11)}),s.primaryFixed=u.fromPalette({name:"primary_fixed",palette:t=>t.primaryPalette,tone:t=>w(t)?40:90,isBackground:!0,background:t=>s.highestSurface(t),contrastCurve:new d(1,1,3,4.5),toneDeltaPair:t=>new V(s.primaryFixed,s.primaryFixedDim,10,"lighter",!0)}),s.primaryFixedDim=u.fromPalette({name:"primary_fixed_dim",palette:t=>t.primaryPalette,tone:t=>w(t)?30:80,isBackground:!0,background:t=>s.highestSurface(t),contrastCurve:new d(1,1,3,4.5),toneDeltaPair:t=>new V(s.primaryFixed,s.primaryFixedDim,10,"lighter",!0)}),s.onPrimaryFixed=u.fromPalette({name:"on_primary_fixed",palette:t=>t.primaryPalette,tone:t=>w(t)?100:10,background:t=>s.primaryFixedDim,secondBackground:t=>s.primaryFixed,contrastCurve:new d(4.5,7,11,21)}),s.onPrimaryFixedVariant=u.fromPalette({name:"on_primary_fixed_variant",palette:t=>t.primaryPalette,tone:t=>w(t)?90:30,background:t=>s.primaryFixedDim,secondBackground:t=>s.primaryFixed,contrastCurve:new d(3,4.5,7,11)}),s.secondaryFixed=u.fromPalette({name:"secondary_fixed",palette:t=>t.secondaryPalette,tone:t=>w(t)?80:90,isBackground:!0,background:t=>s.highestSurface(t),contrastCurve:new d(1,1,3,4.5),toneDeltaPair:t=>new V(s.secondaryFixed,s.secondaryFixedDim,10,"lighter",!0)}),s.secondaryFixedDim=u.fromPalette({name:"secondary_fixed_dim",palette:t=>t.secondaryPalette,tone:t=>w(t)?70:80,isBackground:!0,background:t=>s.highestSurface(t),contrastCurve:new d(1,1,3,4.5),toneDeltaPair:t=>new V(s.secondaryFixed,s.secondaryFixedDim,10,"lighter",!0)}),s.onSecondaryFixed=u.fromPalette({name:"on_secondary_fixed",palette:t=>t.secondaryPalette,tone:t=>10,background:t=>s.secondaryFixedDim,secondBackground:t=>s.secondaryFixed,contrastCurve:new d(4.5,7,11,21)}),s.onSecondaryFixedVariant=u.fromPalette({name:"on_secondary_fixed_variant",palette:t=>t.secondaryPalette,tone:t=>w(t)?25:30,background:t=>s.secondaryFixedDim,secondBackground:t=>s.secondaryFixed,contrastCurve:new d(3,4.5,7,11)}),s.tertiaryFixed=u.fromPalette({name:"tertiary_fixed",palette:t=>t.tertiaryPalette,tone:t=>w(t)?40:90,isBackground:!0,background:t=>s.highestSurface(t),contrastCurve:new d(1,1,3,4.5),toneDeltaPair:t=>new V(s.tertiaryFixed,s.tertiaryFixedDim,10,"lighter",!0)}),s.tertiaryFixedDim=u.fromPalette({name:"tertiary_fixed_dim",palette:t=>t.tertiaryPalette,tone:t=>w(t)?30:80,isBackground:!0,background:t=>s.highestSurface(t),contrastCurve:new d(1,1,3,4.5),toneDeltaPair:t=>new V(s.tertiaryFixed,s.tertiaryFixedDim,10,"lighter",!0)}),s.onTertiaryFixed=u.fromPalette({name:"on_tertiary_fixed",palette:t=>t.tertiaryPalette,tone:t=>w(t)?100:10,background:t=>s.tertiaryFixedDim,secondBackground:t=>s.tertiaryFixed,contrastCurve:new d(4.5,7,11,21)}),s.onTertiaryFixedVariant=u.fromPalette({name:"on_tertiary_fixed_variant",palette:t=>t.tertiaryPalette,tone:t=>w(t)?90:30,background:t=>s.tertiaryFixedDim,secondBackground:t=>s.tertiaryFixed,contrastCurve:new d(3,4.5,7,11)});/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class E{static of(e){return new E(e,!1)}static contentOf(e){return new E(e,!0)}static fromColors(e){return E.createPaletteFromColors(!1,e)}static contentFromColors(e){return E.createPaletteFromColors(!0,e)}static createPaletteFromColors(e,r){const n=new E(r.primary,e);if(r.secondary){const a=new E(r.secondary,e);n.a2=a.a1}if(r.tertiary){const a=new E(r.tertiary,e);n.a3=a.a1}if(r.error){const a=new E(r.error,e);n.error=a.a1}if(r.neutral){const a=new E(r.neutral,e);n.n1=a.n1}if(r.neutralVariant){const a=new E(r.neutralVariant,e);n.n2=a.n2}return n}constructor(e,r){const n=L.fromInt(e),a=n.hue,i=n.chroma;r?(this.a1=S.fromHueAndChroma(a,i),this.a2=S.fromHueAndChroma(a,i/3),this.a3=S.fromHueAndChroma(a+60,i/2),this.n1=S.fromHueAndChroma(a,Math.min(i/12,4)),this.n2=S.fromHueAndChroma(a,Math.min(i/6,8))):(this.a1=S.fromHueAndChroma(a,Math.max(48,i)),this.a2=S.fromHueAndChroma(a,16),this.a3=S.fromHueAndChroma(a+60,24),this.n1=S.fromHueAndChroma(a,4),this.n2=S.fromHueAndChroma(a,8)),this.error=S.fromHueAndChroma(25,84)}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y{get primary(){return this.props.primary}get onPrimary(){return this.props.onPrimary}get primaryContainer(){return this.props.primaryContainer}get onPrimaryContainer(){return this.props.onPrimaryContainer}get secondary(){return this.props.secondary}get onSecondary(){return this.props.onSecondary}get secondaryContainer(){return this.props.secondaryContainer}get onSecondaryContainer(){return this.props.onSecondaryContainer}get tertiary(){return this.props.tertiary}get onTertiary(){return this.props.onTertiary}get tertiaryContainer(){return this.props.tertiaryContainer}get onTertiaryContainer(){return this.props.onTertiaryContainer}get error(){return this.props.error}get onError(){return this.props.onError}get errorContainer(){return this.props.errorContainer}get onErrorContainer(){return this.props.onErrorContainer}get background(){return this.props.background}get onBackground(){return this.props.onBackground}get surface(){return this.props.surface}get onSurface(){return this.props.onSurface}get surfaceVariant(){return this.props.surfaceVariant}get onSurfaceVariant(){return this.props.onSurfaceVariant}get outline(){return this.props.outline}get outlineVariant(){return this.props.outlineVariant}get shadow(){return this.props.shadow}get scrim(){return this.props.scrim}get inverseSurface(){return this.props.inverseSurface}get inverseOnSurface(){return this.props.inverseOnSurface}get inversePrimary(){return this.props.inversePrimary}static light(e){return Y.lightFromCorePalette(E.of(e))}static dark(e){return Y.darkFromCorePalette(E.of(e))}static lightContent(e){return Y.lightFromCorePalette(E.contentOf(e))}static darkContent(e){return Y.darkFromCorePalette(E.contentOf(e))}static lightFromCorePalette(e){return new Y({primary:e.a1.tone(40),onPrimary:e.a1.tone(100),primaryContainer:e.a1.tone(90),onPrimaryContainer:e.a1.tone(10),secondary:e.a2.tone(40),onSecondary:e.a2.tone(100),secondaryContainer:e.a2.tone(90),onSecondaryContainer:e.a2.tone(10),tertiary:e.a3.tone(40),onTertiary:e.a3.tone(100),tertiaryContainer:e.a3.tone(90),onTertiaryContainer:e.a3.tone(10),error:e.error.tone(40),onError:e.error.tone(100),errorContainer:e.error.tone(90),onErrorContainer:e.error.tone(10),background:e.n1.tone(99),onBackground:e.n1.tone(10),surface:e.n1.tone(99),onSurface:e.n1.tone(10),surfaceVariant:e.n2.tone(90),onSurfaceVariant:e.n2.tone(30),outline:e.n2.tone(50),outlineVariant:e.n2.tone(80),shadow:e.n1.tone(0),scrim:e.n1.tone(0),inverseSurface:e.n1.tone(20),inverseOnSurface:e.n1.tone(95),inversePrimary:e.a1.tone(80)})}static darkFromCorePalette(e){return new Y({primary:e.a1.tone(80),onPrimary:e.a1.tone(20),primaryContainer:e.a1.tone(30),onPrimaryContainer:e.a1.tone(90),secondary:e.a2.tone(80),onSecondary:e.a2.tone(20),secondaryContainer:e.a2.tone(30),onSecondaryContainer:e.a2.tone(90),tertiary:e.a3.tone(80),onTertiary:e.a3.tone(20),tertiaryContainer:e.a3.tone(30),onTertiaryContainer:e.a3.tone(90),error:e.error.tone(80),onError:e.error.tone(20),errorContainer:e.error.tone(30),onErrorContainer:e.error.tone(80),background:e.n1.tone(10),onBackground:e.n1.tone(90),surface:e.n1.tone(10),onSurface:e.n1.tone(90),surfaceVariant:e.n2.tone(30),onSurfaceVariant:e.n2.tone(80),outline:e.n2.tone(60),outlineVariant:e.n2.tone(30),shadow:e.n1.tone(0),scrim:e.n1.tone(0),inverseSurface:e.n1.tone(90),inverseOnSurface:e.n1.tone(20),inversePrimary:e.a1.tone(40)})}constructor(e){this.props=e}toJSON(){return{...this.props}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pt(t){const e=gt(t),r=yt(t),n=bt(t),a=[e.toString(16),r.toString(16),n.toString(16)];for(const[i,o]of a.entries())o.length===1&&(a[i]="0"+o);return"#"+a.join("")}function zt(t){t=t.replace("#","");const e=t.length===3,r=t.length===6,n=t.length===8;if(!e&&!r&&!n)throw new Error("unexpected hex "+t);let a=0,i=0,o=0;return e?(a=j(t.slice(0,1).repeat(2)),i=j(t.slice(1,2).repeat(2)),o=j(t.slice(2,3).repeat(2))):r?(a=j(t.slice(0,2)),i=j(t.slice(2,4)),o=j(t.slice(4,6))):n&&(a=j(t.slice(2,4)),i=j(t.slice(4,6)),o=j(t.slice(6,8))),(255<<24|(a&255)<<16|(i&255)<<8|o&255)>>>0}function j(t){return parseInt(t,16)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vt(t,e=[]){const r=E.of(t);return{source:t,schemes:{light:Y.light(t),dark:Y.dark(t)},palettes:{primary:r.a1,secondary:r.a2,tertiary:r.a3,neutral:r.n1,neutralVariant:r.n2,error:r.error},customColors:e.map(n=>_t(t,n))}}function _t(t,e){let r=e.value;const n=r,a=t;e.blend&&(r=ut.harmonize(n,a));const o=E.of(r).a1;return{color:e,value:r,light:{color:o.tone(40),onColor:o.tone(100),colorContainer:o.tone(90),onColorContainer:o.tone(10)},dark:{color:o.tone(80),onColor:o.tone(20),colorContainer:o.tone(30),onColorContainer:o.tone(90)}}}const qt="k3-theme-mode",Ut="k3-theme-seed",Yt="#6750A4";function jt(t){if(t==="dark")return!0;if(t==="light")return!1;if(t==="system")return window.matchMedia("(prefers-color-scheme: dark)").matches;const e=new Date().getHours();return e>=19||e<7}function Gt(t,e){const r=e?t.schemes.dark:t.schemes.light,n=document.documentElement,a=r.toJSON();for(const[c,l]of Object.entries(a)){const f=c.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();n.style.setProperty(`--md-sys-color-${f}`,Pt(l))}const i=t.palettes.neutral,o=(c,l)=>n.style.setProperty(`--md-sys-color-${c}`,Pt(i.tone(l)));e?(o("surface-dim",6),o("surface-bright",24),o("surface-container-lowest",4),o("surface-container-low",10),o("surface-container",12),o("surface-container-high",17),o("surface-container-highest",22)):(o("surface-dim",87),o("surface-bright",98),o("surface-container-lowest",100),o("surface-container-low",96),o("surface-container",94),o("surface-container-high",92),o("surface-container-highest",90))}function Jt(t,e){const r=jt(t),n=Vt(zt(e));return Gt(n,r),document.documentElement.setAttribute("data-theme",r?"dark":"light"),r}function Ht(){const t=localStorage.getItem(qt);return t==="light"||t==="dark"||t==="auto"||t==="system"?t:"system"}function Kt(){const t=Ht(),e=localStorage.getItem(Ut)||Yt;return Jt(t,e)}Kt()})();
