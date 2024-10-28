import{x as F,r as l,V,Z as $,j as c,_ as D,L as g,G as p,z as G,v as m}from"./index-CGi-Suzj.js";import{c as y,R as k,I as L}from"./index-CNoRdSBJ.js";var T="Tabs",[K,Q]=F(T,[y]),h=y(),[z,x]=K(T),N=l.forwardRef((e,a)=>{const{__scopeTabs:t,value:o,onValueChange:r,defaultValue:d,orientation:n="horizontal",dir:u,activationMode:b="automatic",...v}=e,i=V(u),[s,f]=$({prop:o,onChange:r,defaultProp:d});return c.jsx(z,{scope:t,baseId:D(),value:s,onValueChange:f,orientation:n,dir:i,activationMode:b,children:c.jsx(g.div,{dir:i,"data-orientation":n,...v,ref:a})})});N.displayName=T;var C="TabsList",I=l.forwardRef((e,a)=>{const{__scopeTabs:t,loop:o=!0,...r}=e,d=x(C,t),n=h(t);return c.jsx(k,{asChild:!0,...n,orientation:d.orientation,dir:d.dir,loop:o,children:c.jsx(g.div,{role:"tablist","aria-orientation":d.orientation,...r,ref:a})})});I.displayName=C;var R="TabsTrigger",j=l.forwardRef((e,a)=>{const{__scopeTabs:t,value:o,disabled:r=!1,...d}=e,n=x(R,t),u=h(t),b=A(n.baseId,o),v=E(n.baseId,o),i=o===n.value;return c.jsx(L,{asChild:!0,...u,focusable:!r,active:i,children:c.jsx(g.button,{type:"button",role:"tab","aria-selected":i,"aria-controls":v,"data-state":i?"active":"inactive","data-disabled":r?"":void 0,disabled:r,id:b,...d,ref:a,onMouseDown:p(e.onMouseDown,s=>{!r&&s.button===0&&s.ctrlKey===!1?n.onValueChange(o):s.preventDefault()}),onKeyDown:p(e.onKeyDown,s=>{[" ","Enter"].includes(s.key)&&n.onValueChange(o)}),onFocus:p(e.onFocus,()=>{const s=n.activationMode!=="manual";!i&&!r&&s&&n.onValueChange(o)})})})});j.displayName=R;var w="TabsContent",_=l.forwardRef((e,a)=>{const{__scopeTabs:t,value:o,forceMount:r,children:d,...n}=e,u=x(w,t),b=A(u.baseId,o),v=E(u.baseId,o),i=o===u.value,s=l.useRef(i);return l.useEffect(()=>{const f=requestAnimationFrame(()=>s.current=!1);return()=>cancelAnimationFrame(f)},[]),c.jsx(G,{present:r||i,children:({present:f})=>c.jsx(g.div,{"data-state":i?"active":"inactive","data-orientation":u.orientation,role:"tabpanel","aria-labelledby":b,hidden:!f,id:v,tabIndex:0,...n,ref:a,style:{...e.style,animationDuration:s.current?"0s":void 0},children:f&&d})})});_.displayName=w;function A(e,a){return`${e}-trigger-${a}`}function E(e,a){return`${e}-content-${a}`}var B=N,S=I,M=j,P=_;const U=B,q=l.forwardRef(({className:e,...a},t)=>c.jsx(S,{ref:t,className:m("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",e),...a}));q.displayName=S.displayName;const H=l.forwardRef(({className:e,...a},t)=>c.jsx(M,{ref:t,className:m("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",e),...a}));H.displayName=M.displayName;const O=l.forwardRef(({className:e,...a},t)=>c.jsx(P,{ref:t,className:m("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",e),...a}));O.displayName=P.displayName;export{U as T,q as a,H as b,O as c};
