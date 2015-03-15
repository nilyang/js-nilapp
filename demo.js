/**
 * 翻页实例
 * @since 2015-03-15
 */
-(function($,__){
    //以ajax方式翻页
    var funcGetDataList = function(current_page){
        //从ajax获取数据，然后在回调里面调用一下代码：
        //begin success callback:
        var mvc = __.getMvc(),
            pageInfo = {
                page:current_page,
                limit:20,
                total:225,
                handlerType:'roomlist'
            };
        
        mvc.setPageInfo(pageInfo);
        __.Page.genPageAndEvent(mvc.getPageInfo(), function(page){
            funcGetDataList(page);
        });
    
        //end success callback
    };

    //TODO 以页面跳转方式翻页(去掉事件）
    
    
    document.ready = function(){
        funcGetDataList(1);
    };
    
    
})(jQuery,NilApp);