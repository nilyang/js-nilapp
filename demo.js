/**
 * ��ҳʵ��
 * @since 2015-03-15
 */
-(function($,__){
    //��ajax��ʽ��ҳ
    var funcGetDataList = function(current_page){
        //��ajax��ȡ���ݣ�Ȼ���ڻص��������һ�´��룺
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

    //TODO ��ҳ����ת��ʽ��ҳ(ȥ���¼���
    
    
    document.ready = function(){
        funcGetDataList(1);
    };
    
    
})(jQuery,NilApp);