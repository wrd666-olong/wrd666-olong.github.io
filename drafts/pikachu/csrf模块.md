1 get型
2 post 型
# 3
# csrf Token
分析下源码
if(isset($_GET['submit'])){
    if($_GET['sex']!=null && ... && $_GET['token']==$_SESSION['token']){   // 第33行：先校验
        update member ...
    }
}
set_token();   // 第48行：校验"之后"才生成/刷新 token  
也就是说token只有打开修改页面后才会有，因此我们要在受害者点击修改信息之前让它点击恶意链接
http://127.0.0.1:8443/pikachu/vul/csrf/csrftoken/token_get_edit.php?sex=gay&phonenum=18626545453&add=chai&email=vince%40pikachu.com&submit=submit
就会直接修改内容
