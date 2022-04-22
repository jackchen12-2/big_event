  // 1.1 获取裁剪区域的 DOM 元素
  let layer = layui.layer
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)
//   隐藏文件选择框
// 点击按钮选择文件
$('#choosefilebtn').click(function() {
    $('#choosefile').click()
    
})
// 显示用户选择的头像
$('#choosefile').on('change',function(e) {
    // 获取用户文件的属性
    let filelist = e.target.files
    if(filelist.length <= 0) {
        return layer.msg('请先选择文件')
    }
    // 拿到文件信息
    var file = e.target.files[0]
    // 创建一个url地址
    var newImgURL = URL.createObjectURL(file)
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
})
// 向服务器提交用户选择的头像
$('.layui-btn-danger').click(function() {
    let filelist = $('#choosefile').get(0).files
    if(filelist.length <= 0) {
        return layer.msg('请先选择文件')
    }
    // 将图片转换为base64 格式的字符串
    var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    //  发起ajax请求
    $.ajax({
        method:'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success: function(res) {
            if(res.status !== 0) return layer.msg(res.message)
            layer.msg(res.message)
            
            window.parent.getUserMessage()
        }
    }) 
})