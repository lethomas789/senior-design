(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{108:function(e,t,a){e.exports=a(283)},113:function(e,t,a){},115:function(e,t,a){},136:function(e,t,a){},271:function(e,t,a){},273:function(e,t,a){},275:function(e,t,a){},283:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),i=a(17),o=a.n(i),c=(a(113),a(21)),l=a(22),s=a(26),u=a(23),m=a(25),d=a(286),p=a(285),h=(a(115),a(27)),g=a(42),E=a.n(g),f=a(28),v=a.n(f),b=a(24),w=a.n(b),j=(a(136),function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).state={firstName:"",lastName:"",email:"",password:"",confirmPassword:""},a.sendSignup=a.sendSignup.bind(Object(h.a)(Object(h.a)(a))),a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"sendSignup",value:function(){E.a.post("http://localhost:4000/api/signup",{params:{firstName:this.state.firstName,lastName:this.state.lastName,email:this.state.email,password:this.state.password}}).then(function(e){e.data.success,alert(e.data.message)}).catch(function(e){console.log(e)})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{id:"signupContainer"},r.a.createElement("div",{id:"signupForms"},r.a.createElement("h1",null," Sign Up "),r.a.createElement("div",{id:"row"},r.a.createElement(v.a,{label:"First Name",required:"true",onChange:function(t){return e.setState({firstName:t.target.value})}})),r.a.createElement("div",{id:"row"},r.a.createElement(v.a,{label:"Last Name",required:"true",onChange:function(t){return e.setState({lastName:t.target.value})}})),r.a.createElement("div",{id:"row"},r.a.createElement(v.a,{label:"Email",required:"true",onChange:function(t){return e.setState({email:t.target.value})}})),r.a.createElement("div",{id:"row"},r.a.createElement(v.a,{type:"password",label:"Password",required:"true",onChange:function(t){return e.setState({password:t.target.value})}})),r.a.createElement(w.a,{id:"signupButton",onClick:this.sendSignup}," Sign Up  ")))}}]),t}(n.Component)),O=(a(271),function(e){function t(){return Object(c.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{id:"homeContainer"},r.a.createElement("div",{id:"textContainer"},r.a.createElement("h1",null," Welcome to ECS193 ECommerce! "),r.a.createElement("p",null,"This is a ecommerce website for UC Davis's clubs. Here we make merchandise available from all different clubs of Davis.")))}}]),t}(n.Component)),C=(a(273),function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).state={email:"",password:""},a.sendLogin=a.sendLogin.bind(Object(h.a)(Object(h.a)(a))),a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"sendLogin",value:function(){E.a.post("http://localhost:4000/api/login",{params:{email:this.state.email,password:this.state.password}}).then(function(e){!0===e.data.success?alert(e.data.message):alert(e.data)}).catch(function(e){alert(e)})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{id:"loginContainer"},r.a.createElement("div",{id:"loginForms"},r.a.createElement("h1",null," Login "),r.a.createElement("div",{id:"row"},r.a.createElement(v.a,{label:"Email",required:"true",onChange:function(t){return e.setState({email:t.target.value})}})),r.a.createElement("div",{id:"row"},r.a.createElement(v.a,{type:"password",label:"Password",required:"true",onChange:function(t){return e.setState({password:t.target.value})}})),r.a.createElement(w.a,{id:"signupButton",onClick:this.sendLogin}," Login  ")))}}]),t}(n.Component)),S=a(284),k=a(60),N=a.n(k),y=a(61),L=a.n(y),q=a(64),x=a.n(q),B=a(62),U=a.n(B),F=a(63),P=a.n(F);a(275);var W=function(e){return r.a.createElement("div",{className:"root"},r.a.createElement(N.a,{position:"static"},r.a.createElement(L.a,null,r.a.createElement(U.a,{className:"menuButton",color:"inherit","aria-label":"Menu"},r.a.createElement(P.a,null)),r.a.createElement(x.a,{component:S.a,to:"/",variant:"h6",color:"inherit",className:"grow"},"ECS193 ECommerce"),r.a.createElement(w.a,{component:S.a,to:"/signup",color:"inherit"}," Sign Up "),r.a.createElement(w.a,{component:S.a,to:"/login",color:"inherit"},"Login "))))},D=function(e){function t(){return Object(c.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return r.a.createElement(d.a,null,r.a.createElement("div",null,r.a.createElement(W,null),r.a.createElement(p.a,{exact:!0,path:"/",component:O}),r.a.createElement(p.a,{exact:!0,path:"/signup",component:j}),r.a.createElement(p.a,{exact:!0,path:"/login",component:C})))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(D,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[108,2,1]]]);
//# sourceMappingURL=main.d27af120.chunk.js.map