$(function() {
    // 定义一个查询参数对象
    let q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    let layer = layui.layer
    let form = layui.form
    // 定义一个请求数据的函数
    function getArtData() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if(res.status !==0 ) {
                    return layer.msg(res.message)
                }
                console.log(res)
               let htmlstr = template('artData_lis',res)
                $('tbody').html( htmlstr )
                renderPage(res.total)
            }
         })
    }
    getArtData()
    // 定义一个时间过滤器语法
    template.defaults.imports.dataFormat= function (value) {
        let newdate = new Date(value)
        // 获取年月日
        let s = newdate.getSeconds()
        s = s >=10 ? s : '0' + s
        let i = value.lastIndexOf(':')
        let timeStr = value.slice(0,i+1)
        return timeStr + s
    }
//    发起ajax请求渲染分类列表
    function renderCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if(res.status !== 0 ) return console.log('获取数据失败')
               
                let arr = res.data
                arr.forEach((e,i) => {
                   
                    $('#cates_id').append(`
                    <option value="${e.Id}">${e.name}</option>`)
                })
                form.render()
            }
        })
    }
    renderCateList()
    // 实现筛选功能
    $('.layui-form').on('submit',function(e) {
        e.preventDefault()
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        getArtData()
    })
    // 导入layui分页对象
    laypage = layui.laypage
    // 封装一个渲染分页的函数
    function renderPage(total) {
        // 利用layui渲染分页
        laypage.render({
            elem: 'paging',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout:['count','limit','prev','page','next','skip'],
            limits: [2,4,6,8,10,20],
            // jump函数的第二个参数即是在laypage.render调用时执行jump且它的值为true
            jump: function(obj,first) {
                // 获取当前页码值并重新赋值配置对象q
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first){
                    getArtData()
                }
                // getArtData()
            }
        })
    }

    // 点击删除功能
    $('tbody').on('click','#delete',function() {
        let i = $(this).attr('data-Id')
        // 获取按钮数量
        let deles = $('.layui-btn-danger').length
        layer.confirm('确定删除吗？', {icon: 3, title:'提示'}, function(index){
            //删除
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + i,
                success :function(res) {
                    if(res.status !== 0 ) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    // 重新渲染
                    if (deles === 1 ) {
                        q.pagenum = p.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    getArtData()
                }
            })
            
            layer.close(index);
          });
    })
   
    $('tbody').on('click','#art_change',function() {
        let i = $(this).attr('data-Id')
        location.href = './art_change.html'
        localStorage.setItem('id',i)
    })
})
