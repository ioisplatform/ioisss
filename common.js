/* IOIS shared footer + navigation helpers */
(function(){
  const page = location.pathname.split('/').pop() || 'index.html';
  document.addEventListener('DOMContentLoaded', function(){
    if(!document.querySelector('.iois-footer')){
      const footer=document.createElement('footer');
      footer.className='iois-footer';
      footer.innerHTML=`<div class="container"><div><strong>IOIS PLATFORM</strong><span>Indian Online Income Supporting System • बदलते भारत की शान</span></div><div class="iois-footer-links"><a href="index.html">Home</a><a href="membership.html">Membership</a><a href="register.html">Register</a><a href="login.html">Login</a><a href="contact.html">Contact</a><a href="about.html">About</a></div><small>© ${new Date().getFullYear()} IOIS PLATFORM. All rights reserved.</small></div>`;
      document.body.appendChild(footer);
    }
  });
  window.IOIS_GO_HOME=()=>location.href='index.html';
  window.IOIS_GO_REGISTER=(plan)=>location.href='register.html'+(plan?'?plan='+encodeURIComponent(plan):'');
})();
