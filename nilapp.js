/**
 * 常用组件基础库，包括弹窗、地图、验证等常用组建
 * 依赖库: 
 *   UI-->jQuery UI Dialog
 *   DOM-->jQuery
 *   Map --> BaiduMap
 *   
 * @author yanghualiang<nil.yang@qq.com>
 * @since 2013-12-04
 */
var NilApp = NilApp || {};
/**
 * 基础
 * @since 2014-01-10
 */
-(function($, __){
    //引入sprintf
    /*! sprintf.js | Copyright (c) 2007-2013 Alexandru Marasteanu <hello at alexei dot ro> | 3 clause BSD license */
    -(function(e){function r(e){return Object.prototype.toString.call(e).slice(8,-1).toLowerCase()}function i(e,t){for(var n=[];t>0;n[--t]=e);return n.join("")}var t=function(){return t.cache.hasOwnProperty(arguments[0])||(t.cache[arguments[0]]=t.parse(arguments[0])),t.format.call(null,t.cache[arguments[0]],arguments)};t.format=function(e,n){var s=1,o=e.length,u="",a,f=[],l,c,h,p,d,v;for(l=0;l<o;l++){u=r(e[l]);if(u==="string")f.push(e[l]);else if(u==="array"){h=e[l];if(h[2]){a=n[s];for(c=0;c<h[2].length;c++){if(!a.hasOwnProperty(h[2][c]))throw t('[sprintf] property "%s" does not exist',h[2][c]);a=a[h[2][c]]}}else h[1]?a=n[h[1]]:a=n[s++];if(/[^s]/.test(h[8])&&r(a)!="number")throw t("[sprintf] expecting number but found %s",r(a));switch(h[8]){case"b":a=a.toString(2);break;case"c":a=String.fromCharCode(a);break;case"d":a=parseInt(a,10);break;case"e":a=h[7]?a.toExponential(h[7]):a.toExponential();break;case"f":a=h[7]?parseFloat(a).toFixed(h[7]):parseFloat(a);break;case"o":a=a.toString(8);break;case"s":a=(a=String(a))&&h[7]?a.substring(0,h[7]):a;break;case"u":a>>>=0;break;case"x":a=a.toString(16);break;case"X":a=a.toString(16).toUpperCase()}a=/[def]/.test(h[8])&&h[3]&&a>=0?"+"+a:a,d=h[4]?h[4]=="0"?"0":h[4].charAt(1):" ",v=h[6]-String(a).length,p=h[6]?i(d,v):"",f.push(h[5]?a+p:p+a)}}return f.join("")},t.cache={},t.parse=function(e){var t=e,n=[],r=[],i=0;while(t){if((n=/^[^\x25]+/.exec(t))!==null)r.push(n[0]);else if((n=/^\x25{2}/.exec(t))!==null)r.push("%");else{if((n=/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(t))===null)throw"[sprintf] huh?";if(n[2]){i|=1;var s=[],o=n[2],u=[];if((u=/^([a-z_][a-z_\d]*)/i.exec(o))===null)throw"[sprintf] huh?";s.push(u[1]);while((o=o.substring(u[0].length))!=="")if((u=/^\.([a-z_][a-z_\d]*)/i.exec(o))!==null)s.push(u[1]);else{if((u=/^\[(\d+)\]/.exec(o))===null)throw"[sprintf] huh?";s.push(u[1])}n[2]=s}else i|=2;if(i===3)throw"[sprintf] mixing positional and named placeholders is not (yet) supported";r.push(n)}t=t.substring(n[0].length)}return r};var n=function(e,n,r){return r=n.slice(0),r.splice(0,0,e),t.apply(null,r)};e.sprintf=t,e.vsprintf=n})(__);

    __.inArray = function(val, arr,i){
        var idx=-1;
        if (typeof arr.indexOf !== "function"){
            for(i= i||0,len=arr.length; i < len; i++){
                if (arr[i] === val){
                    idx = i;break;
                }
            }
        }else{
            idx = arr.indexOf(val,i);
        }
        return idx==-1?false:true;
    };

    __.trim = function(str){
          return String(str).replace(/^\s+/,'').replace(/\s+$/,'');
    };
})(jQuery, NilApp);

/**
 * 初始化地图模型全局
 *
 * 用时加载
 *  $(function(){
 *      NilApp.Map.loadMapScript(function(){
 *          NilApp.Map.newInstance("em_mapContainer");
 *      });
 *  });
 *
 * @author yanghualiang
 * @since 2013-12-04
 */
-(function ($,__) {
    //初始化

    __.Map = __.Map || {};
    __.Map.BMap = __.Map.BMap || {};
    __.Map.city = __.Map.city || {name: '', location: ''};
    //地图取默认城市
    __.Map.map_init_location = function (callbackfunc) {
        var myCity = new BMap.LocalCity();
        myCity.get(function (result) {
            __.Map.city.name = result.name;
            __.Map.city.location = result.center.lng + "," + result.center.lat;

            callbackfunc(result.center);
        });
    };
    __.Map.newInstance = function(map_container_id){
        __.Map.map_init_location(function(center){
            document.getElementById(map_container_id).innerHTML = "";
            __.Map.BMap = new BMap.Map(map_container_id);
            __.Map.BMap.enableScrollWheelZoom(true);
            __.Map.BMap.addControl(new BMap.NavigationControl());
            //必须（用坐标）初始化地图，否则baidu map会报错（lng不存在之类）
            var point = new BMap.Point(center.lng, center.lat);  // 创建点坐标
            __.Map.BMap.centerAndZoom(point, 15);         // 初始化地图，设置中心点坐标和地图级别
        });
    };

    __.Map.loadMapScript = function (callbackfun) {
        __.Map.callbackfun = function(){
            callbackfun();
        };
        var script = document.createElement("script");
        script.src = "http://api.map.baidu.com/api?v=2.0&ak=1b07deef69d556db4258162ef64b3eb5&callback=__.Map.callbackfun";
        document.body.appendChild(script);
    };

    //每次调用地图前，清除之前的百度地图异步加载script node
    __.Map.removeMapScript=function(){
        $("body").find("script").each(function(idx,obj){
            //console.log(idx,obj)
            if (obj && obj.src && /https?:\/\/api.map.baidu.com/.test(obj.src)){
                $(obj).remove();
            }
        });
    };

})(jQuery,NilApp);



/**
 * 小窗提示信息
 * 依赖: jquery dialog
 * @author yanghualiang
 * @since 2013-12-17
 */
-(function($,__){
	/*=定制提示 2013-12-20 by yanghualiang=*/
	/*
	.ui_content .nilapp-dialog-prompt{background: url("icons/prompt.gif") 0 10px no-repeat;}
	.ui_content .nilapp-dialog-confirm{background: url("icons/confirm.gif") 0 10px no-repeat;}
	.ui_content .nilapp-dialog-alert{background: url("icons/alert.gif") 0 10px no-repeat;}
	.ui_content .nilapp-dialog-success{background: url("icons/success.gif") 0 10px no-repeat;}
	.nilapp-dialog-content{font-size:16px;vertical-align: middle;text-align: center}
	.ui_content .nilapp-dialog-content-icon{float: none;vertical-align: middle;display:inline-block;padding-top:24px;padding-left:65px;width:auto;height:48px;border:0px;}
	.ui_content .nilapp-dialog-content-html{float: none;vertical-align: middle;}
   */
	
    /**
     * 通用操作提示消息弹窗
     * @param {string} content 提示信息
     * @param {int} timetoclose 弹窗关闭时间，不填则不自动关闭
     * @param {object} options dialog 配置选项，可以根据需要自定义
     */
    __.showMsg = function(title, content, timetoclose,options){
        var _options = {max:false,min:false,lock:true,title:title,content: content};
        if (!!options && $.isPlainObject(options)){
            options = $.extend({},_options,options)
        }
        if (typeof timetoclose != 'number'){
            $.dialog(options);
        }else{
            if (!$.isNumeric(timetoclose)){
                timetoclose = 2;
            }else{
                timetoclose = Number(timetoclose).toFixed(0);
            }

            $.dialog(options).time(timetoclose);
        }
    };

    /**
     * err消息弹窗，一般用于操作失败之后提示。
     * @param {string} content 提示信息
     * @param {int} timetoclose 弹窗关闭时间，不填则不自动关闭
     * @param {object} options {foo:'bar'}
     */
    __.showErrMsg = function(content,timetoclose,options){
        var _options = {max:false,min:false,lock:true,title:'提示',content: content, icon:'alert.gif'};
        if (!!options && $.isPlainObject(options)){
            _options = $.extend({},_options,options)
        }

        this.showMsg('', '',timetoclose,_options);
    };
    /**
     * ok消息弹窗，一般用于操作成功之后提示。
     * @param {string} content 提示信息
     * @param {int} timetoclose 弹窗关闭时间，不填则不自动关闭
     * @param {object} options {foo:'bar'}
     */
    __.showOkMsg = function(content,timetoclose,options){
        var _options = {max:false,min:false,lock:true,title:'提示',content: content, icon:'success.gif'};
        if (!!options && $.isPlainObject(options)){
            _options = $.extend({},_options,options)
        }
        this.showMsg('', '',timetoclose,_options);
    };

    /**
     * 宽500px，高200px 确认提示弹窗。
     * options = {  icon:'alert', //[选填]图标
     *              title:'hello',//[选填]弹窗标题(不设置则“提示”)
     *              content:'world',//[选填]内容
     *              ok:function(){return some_callback1();} //ok按钮的回调
     *              okVal:'确定' //ok按钮的文字
     *              cancel:function(){return some_callback2();}//cancel按钮的回调
     *              cancelVal:'关闭' //cancel按钮文字
     *              }
     * @param {object} options
     * @param {object} ext_options 扩展
     */
    __.dialogConfirm = function(options, ext_options){
        options = options || {};
        var icon =  typeof(options.icon) =='string' && this.inArray(options.icon, ['prompt','alert','success','confirm']) ? options.icon:'confirm',
            html_tile =  typeof (options.title) == 'string' ? options.title:'提示',
            html_content =  typeof options.content=='string' ? options.content:'&nbsp;',
            callback_ok =  $.isFunction(options.ok) ? options.ok : function(){},
            callback_cancel =  $.isFunction(options.cancel) ? options.cancel : function(){},
            ok_val =  typeof(options.okVal) == 'string' ? options.okVal:'确定',
            cancel_val =  typeof(options.cancelVal) =='string' ? options.cancelVal:'关闭' ;
        icon = !!options.icon  ? '': icon;
        var html_icon_content;
        var icon_str = !!icon ? ['<td><div class="nilapp-dialog-content-icon nilapp-dialog-',icon,'"></td>'].join(''):'';
        html_icon_content  = [
            '<table><tr>',
            icon_str,
            '<td class="nilapp-dialog-content-html">',html_content,'</td>',
            '</tr></table>'
        ].join('');

        ext_options = $.isPlainObject(ext_options) ? ext_options:{};
        var final_options = $.extend({},{width:'486px',height:'110px',lock:true,max:false,min:false,
            title:html_tile,
            content:html_icon_content,
            ok:function(){
                return callback_ok();
            },
            okVal:ok_val,
            cancel:function(){
                return callback_cancel();
            },
            cancelVal:cancel_val
        },ext_options);

        $.dialog(final_options);

        $(".ui_buttons input:button").removeClass("ui_state_highlight").addClass('btn');
        $(".ui_buttons input:button:eq(0)").addClass('btn-primary');
    };

    /**
     * 自定义弹窗，默认参数类似  NilApp.dialogConfirm，
     * !! 区别是，本弹窗可以定义 button、宽高，没有默认图标（若需要，需显示传入）
     * @param {object} options
     */
    __.dialog = function(options){
        options = options || {};
        var icon = typeof(options.icon) =='string'
                && this.inArray(options.icon, ['prompt','alert','success','confirm'])
                ? options.icon:null,
            html_tile = typeof (options.title) == 'string' ? options.title:'提示',
            html_content = typeof options.content=='string' ? options.content:'&nbsp;',
            callback_ok = $.isFunction(options.ok) ? options.ok : null,
            callback_cancel = $.isFunction(options.cancel) ? options.cancel : null,
            ok_val =  typeof(options.okVal) == 'string' ? options.okVal:null,
            cancel_val = typeof(options.cancelVal) =='string' ? options.cancelVal:null ,
            button = $.isArray(options.button) ? options.button : null;
        icon = options.icon === false ? '': icon;
        var icon_str = !!icon ? ['<td><div class="nilapp-dialog-content-icon nilapp-dialog-',icon,'"></td>'].join(''):'';
        html_icon_content  = [
            '<table><tr>',
            icon_str,
            '<td class="nilapp-dialog-content-html">',html_content,'</td>',
            '</tr></table>'
        ].join('');

        var default_btns = {};
        if (!!options.useDefaultBtn){
            if (typeof callback_ok == "function"){
                default_btns.ok = function(){
                    return callback_ok();
                };
                default_btns.okVal = !!ok_val ? ok_val : '确定';
            }
            if (typeof callback_cancel == "function"){
                default_btns.cancel = function(){
                    return callback_cancel();
                };
                default_btns.cancelVal = !!cancel_val ? cancel_val : '关闭';
            }
        }

        var width, height,button_option = !! button ? {button:button} : {};;
        width = !!options.width?options.width:'486px';
        height = !!options.height?options.height:'110px';

        var final_options = $.extend({},{width:width,height:height,lock:true,max:false,min:false,
            title:html_tile,
            content:html_icon_content
        },default_btns,button_option);
        console.log(button_option,final_options);
        $.dialog(final_options);

        $(".ui_buttons input:button").removeClass("ui_state_highlight").addClass('btn');
        $(".ui_buttons input:button:eq(0)").addClass('btn-primary');
    }
})(jQuery,NilApp);

/**
 * 输入框错误提示抖动
 * 依赖: jquery
 * @author yanghualiang
 * @since 2013-12-17
 */
-(function($,__){
    __.shakeInputOnError = function (obj, isok){
        if (isok){
            $(obj).css({"background-color":"#ffffff","color":"#555555","border":"1px solid #cccccc"});
            return true;
        }else{
            $(obj).css({"background-color":"#f2dede","color":"#b94a48","border":"2px solid"});
            setTimeout(function(){
                $(obj).css({"background-color":"#ffffff","color":"#555555","border":"1px solid #cccccc"})
                setTimeout(function(){
                    $(obj).css({"background-color":"#f2dede","color":"#b94a48","border":"2px solid"});
                },100);
            },300);
            return false;
        }
    };
})(jQuery,NilApp);

/**
 * 验证函数集合
 */
-(function($,__){
    /**
     * email全匹配验证
     * @param {stirng} email
     * @returns {boolean}
     */
    __.validateEmail = function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    /**
     * 电话号码正则表达式（支持手机号码，3-4位区号，7-8位直播号码，1－4位分机号）
     * @param {string} phone
     * @returns {boolean}
     */
    __.validateTel = function(phone){
        var reg = /^(?:\d{11}|(?:\d{7,8}|(?:\d{4}|\d{3})-\d{7,8}|(\d{4}|\d{3})-\d{7,8}-(?:\d{4}|\d{3}|\d{2}|\d{1})|\d{7,8}-(?:\d{4}|\d{3}|\d{2}|\d{1})))$/;
        return reg.test(phone);
    };

    /**
     * 手机号验证
     * @param {string} phone
     * @returns {boolean}
     */
    __.validateMobile = function(phone){
        var reg = /^\d{11}$/;
        return reg.test(phone);
    };

    __.validateInt = function(ival){
        return /^(?:[-+]?[1-9]\d*|0)$/.test(String(ival));
    };
    __.validateFloat = function(fval){
        return /^(?:[-+]?(?:[1-9]\d*|0)(\.\d+)?)$/.test(String(fval));
    }

    __.validateDateTime = function(fdate){
        return /^\s*(\d{4}-(?:0[1-9]|[1-9]|1[012])-(?:0?[1-9]|[1-2]\d|3[0-1]))(?:\s+((?:[0-1]?\d|2[0-3])(?:\:[0-5]?\d(?:\:[0-5]?\d)?)?))?\s*$/
            .test(String(fdate));
    }

})(jQuery,NilApp);

/**
 * 数学函数集合
 */
-(function($,__){
    /**
     * 浮点数字截取函数，获取指定位数小数，最后一位小数四舍五入
     * {字符串处理法}
     *
     * @since 2013-12-27
     * @param {float} fval
     * @param {int} fixed_num 精度位数(不限精度)
     * @returns {boolean}
     */
    __.floatToFixed = function(fval,fixed_num) {
        fval = [fval].join('');//toString
        fixed_num = typeof fixed_num=='number' && this.validateInt(fixed_num)
            ? parseInt(fixed_num) : 2;
        if (fixed_num < 0)
            return false;
        if (this.validateInt(fval)){
            var intNum = fval,dotNum=[];
            for(var i=0;i<fixed_num;i++){
                dotNum.push(0);
            }

            return fixed_num>0?[intNum,dotNum.join('')].join('.'):intNum;
        };
        if (!this.validateFloat(fval)){
            return false;
        }
        var _val_arr = fval.split('.'),
            intNum = String(_val_arr[0]),
            dotNum = String(_val_arr[1]),
            signOne=intNum/Math.abs(intNum),//(-|+)1
            _dotNum,
            _ret_fval;

        //计算小数
        if (dotNum.length < fixed_num){
            var _zero_arr= [dotNum];
            for(var i= 0,len = fixed_num - dotNum.length;i<len;i++){
                _zero_arr.push(0);
            }
            _dotNum = _zero_arr.join('');
        }else if (dotNum.length > fixed_num){
            _dotNum = dotNum.substr(0, fixed_num+1);
        }else{
            _dotNum = [dotNum,'0'].join('');
        }

        dotNum = Math.round(Number(_dotNum) /10);
        var _dot_num_len = String(dotNum).length;
        if (_dot_num_len<fixed_num){
            var _zero_arr = [dotNum];
            for(var i= 0,len=fixed_num-_dot_num_len;i<len;i++){
                _zero_arr.push(0);
            }
            dotNum = _zero_arr.join('');//固定小数位数
        }

        _ret_fval = fixed_num>0 ?
            [intNum,dotNum].join('.')
            : String(Math.abs(Number(intNum)+(signOne*dotNum))*signOne);
        return _ret_fval;
    };

    /**
     * 浮点数取精度，默认2位，最后一位小数四舍五入
     * 如果要取大于20位精度的小数，则可使用 __.floatToFixed
     * {利用数学函数的精简算法}
     *
     * @since 2013-12-28
     * @param {number} fval
     * @param {int} [fixed_num=0-20] 可选，若不填，默认2
     * @returns {number}
     */
    __.floatRound = function(fval,fixed_num){
        if (!this.validateFloat(fval)){
            return false;
        }
        fixed_num = this.validateInt(fixed_num) ? fixed_num : 2;
        if (fixed_num > 20){
            return this.floatToFixed(fval,fixed_num);
        }
        var _divid=Math.pow(10,fixed_num);
        return (Math.round(fval*_divid)/_divid).toFixed(fixed_num);
    };
	
    /**
     *link: http://phpjs.org/functions/number_format
     * @param number
     * @param decimals
     * @param dec_point
     * @param thousands_sep
     * @returns {*|string}
     */
    __.numberFormat = function (number, decimals, dec_point, thousands_sep) {
        number = (number + '')
            .replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + (Math.round(n * k) / k)
                    .toFixed(prec);
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
            .split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '')
            .length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1)
                .join('0');
        }
        return s.join(dec);
    };

})(jQuery,NilApp);


/**
 * nilapp web service base class
 */
-(function($,__){

    var Service = function(){};
    Service.prototype = {
        url : '#',
        type : 'post',
        dataType : 'json',
        async : true,//异步
        cache : false,//缓存
        timeout:20000,//超时时间ms
        success : function(){},
        error : function(){},
        sendAjax : function(params,succfun,errfun){
            var _data = params,that = this;
            succfun = typeof succfun == "function"? succfun: function(){};
            errfun = typeof errfun == "function"? errfun: function(){};
            $.ajax({
                url: that.url,
                type: that.type,
                dataType: that.dataType,
                async: that.async,
                data:_data,
                cache:that.cache ,
                timeout:that.timeout,
                success:function(result, textStatus, jqXHR){
                    succfun(result);
                },
                error:function(){
                    errfun();
                },
                timeout:function(){

                },
                complete:function(jqXHR, textStatus ){
                    console.log(textStatus)
                    switch (textStatus){
                        case 'success':break;
                        case 'error':break;
                        case 'timeout':__.showErrMsg('网络超时，请稍后重试');break;
                        case 'notmodified':break;
                        case 'abort':break;
                        case 'parsererror':
                            __.showErrMsg('请求的响应字符串无法解析');
                            break;
                    }

                }
            });
        }
    };

    __.__Service = Service;
    __.newService = function(){
        var srv_obj = function(){};
        srv_obj.prototype = new this.__Service();
        return new srv_obj();
    };
})(jQuery,NilApp);

/**
 * ajax翻页相关
 * @author yhl<nil.yang@qq.com>
 * @since 2014-01-10
 */
-(function($,__){
    /*__.Page 分页用到的样式
    .page-wrapper{background-color: #ffffff;border-radius:0;box-shadow:0;line-height: 28px;}
    .page-wrapper a,.page-wrapper a:active,.page-wrapper a:visited{color: #ffffff;background-color: #6faed9;text-decoration:none;cursor: pointer;border:1px 0 1px 1px solid #bec9d4; padding:2px 8px;}
    .page-wrapper a:hover{background-color:#fafafa;color: #2283c5;}
    .page-wrapper .page-total{color: #ff6600}
    .page-wrapper .page-pre{margin: 0 10px 0 0;}
    .page-wrapper .page-next{margin: 0 0 0 10px;}
    .page-wrapper .page-current{color: #FF0000;height: 28px; font: bold 16px; padding: 2px 8px; background-color: #f5f5f5;}
    .page-wrapper .page-dotted{color: #444444;}
    */

    var Page={
        /**
         * 翻页方法（若第二项不填写，则为turnPageCallbackFun）
         * @param pageInfo
         * @param [selector]
         * @param [turnPageCallbackFun]
         */
        genPageAndEvent:function(pageInfo, turnPageCallbackFun ){
            this.turnPage(pageInfo.page, pageInfo.page_all, pageInfo.handlerType);
            var total = parseInt(pageInfo.total);
            if (false == isNaN(total)){
                this.page_info.total = total;
            }
            if (typeof turnPageCallbackFun == "function"){
                $("a[id^=a-page-]").unbind("click").bind("click",function(){
                    var id=$(this).attr("id"),
                        tmparr= id.split('-'),
                        _page = tmparr.pop(),
                        _handler_type = tmparr.pop();
                    turnPageCallbackFun(_page);//绑定翻页事件
                });
            }
        },
        turnPage:function(page, page_all, handler_type, selector){
            selector = typeof selector == "string" && /^[#.][^"']+$/.test(selector)? selector : "#ajaxpage-" + handler_type;
            var _page_str = this.getAjaxPageStr(page, page_all,handler_type);
            $(selector).html(_page_str).show();
         },
        getAjaxPageStr:function(page, page_all,handler_type){
            return this.genPageStr(page, page_all, "#", handler_type,true);
        },
        page_info:{page:1, page_all:1, total:0, base_url:"#", isAjax:false, handler_type:'handler', withWrapper:false},
        param_check:function(page,page_all,base_url,handler_type){
            page = parseInt(page);
            page_all = parseInt(page_all);
            if(isNaN(page) || typeof page==undefined){
                page = 1;
            }
            if(isNaN(page_all) || typeof page_all==undefined){
                page_all = 1;
            }
            if (typeof handler_type !== "string"){
                handler_type = this.page_info.handler_type;
            }

            page = page < 1 ? 1 : page;
            page_all = page_all < 1 ? 1 : page_all;

            this.page_info.page = page;
            this.page_info.page_all = page_all;
            this.page_info.handler_type = handler_type;
            this.page_info.base_url = typeof base_url !=='string' ? "#":base_url;
        },
        genPageATagId:function(page, handler_type){
            return ["a-page-",handler_type,"-",page].join('');
        },
        genPageStr:function(page,page_all,base_url,handler_type,isAjax){
            this.param_check(page,page_all,base_url,handler_type);
            page = this.page_info.page;
            page_all = this.page_info.page_all;
            base_url = this.page_info.base_url;
            handler_type = this.page_info.handler_type;
            var total_str = this.page_info.total > 0 ? '<span>共计'+this.page_info.total+'条记录</span>':'';
            var withWrapper = this.page_info.withWrapper;

            var pre_page = 1 == page ? page : page - 1,
                next_page = page+1;
            if (false == /\?/.test(base_url)){
                base_url += "?";
            }
            if (page == page_all && 1 == page_all){
                return '<span class="page-total">共1页</span>'+total_str;
            }

            next_page = page >= page_all ? page_all : page+1;

            var tpl_page = base_url+"&page=%d";
            var url_prefix = isAjax ? '#' : __.sprintf(tpl_page, pre_page);
            //first
            var a_tag_id = this.genPageATagId(pre_page, handler_type);
            var str_page = 1 == page ?  '' : __.sprintf('<a class="page-pre" id="%s" href="%s" title="第%d页">上一页</a>', a_tag_id, url_prefix, pre_page);
            //middle
            if (page<=6){
                var max_page = page_all < 10 ? page_all : 10;
                for(var i=1; i<=max_page; i++){
                    url_prefix = isAjax ? '#' : __.sprintf(tpl_page,i);
                    a_tag_id = this.genPageATagId(i, handler_type);

                    str_page += (i == page) ?
                        __.sprintf('<span class="page-current">%d</span>', i)
                        : __.sprintf('<a id="%s" href="%s" title="第%d页">%d</a>'
                        , a_tag_id, url_prefix, i, i);
                }
            }else{
                url_prefix = isAjax ? '#' : __.sprintf(tpl_page,1);
                a_tag_id = this.genPageATagId(1, handler_type);

                str_page += __.sprintf( '<a id="%s" href="%s" title="第%d页">1</a>' +
                    '<a class="page-dotted"href="javascript:void(0);">...</a>'
                    , a_tag_id, url_prefix, 1);

                var end_page = page+ 4,
                    start = page-3;
                end_page = end_page >= page_all ? page_all : end_page;
                for(var i=start; i<=end_page; i++){
                    url_prefix = isAjax ? '#' : __.sprintf(tpl_page, i);
                    a_tag_id = this.genPageATagId(i, handler_type);
                    str_page += (i == page) ?
                        __.sprintf('<span class="page-current">%d</span>', page)
                        : __.sprintf('<a id="%s" href="%s" title="第%d页">%d</a>', a_tag_id, url_prefix, i, i);
                }
            }

            //last
            url_prefix = isAjax ? '#' : __.sprintf(tpl_page, next_page);
            a_tag_id = this.genPageATagId(next_page, handler_type);
            str_page += page == page_all ? '' : __.sprintf('<a class="page-next" id="%s" href="%s">下一页</a>'
                , a_tag_id, url_prefix);
            var page_string = __.sprintf('%s <span class="page-total">共%d页</span>%s', str_page, page_all,total_str);
            return (withWrapper ? __.sprintf('<div class="page-wrapper">%s</div>', page_string) : page_string);
        }
    };

    __.Page = Page;
})(jQuery,NilApp);

/**
 * js MVC 
 * 已实现：模型，翻页等
 * TODO： view、controller、js service 调用例子等
 * @author NilYang<nil.yang@qq.com>
 * @since 2015.03.15
 */
-(function($,__){
    
    var mvc = function(){
        this.pageInfo = { limit: 10,offset: 0,total: 0,page: 1,page_all:0,handlerType:''};
        this.dataList = [];

        this.setPageInfo = function(pageInfo){
            this.pageInfo.page = pageInfo.page;
            this.pageInfo.limit = pageInfo.limit;
            this.pageInfo.total = pageInfo.total;
            this.pageInfo.handlerType = pageInfo.handlerType;
            this.pageInfo.page_all = this.getPageAll();
        };
        this.getPageInfo = function(){
            return this.pageInfo;
        };
        this.getPageAll = function(){
            var per_page =this.pageInfo.limit,
                total = this.pageInfo.total,
                pages_all = Math.ceil(total / per_page);
            return (pages_all < 1 ? 1: pages_all);
        };
        this.getItemById = function(id){
            var datas = this.dataList,item;
            for(var i=0 ,len = datas.length; i<len; i++){
                if (datas[i].id == id){
                    item = datas[i];
                    break;
                }
            }
            return item;
        };
    }
        
    __.getMvc = function(){
        return new mvc();
    };
    
})(jQuery,NilApp);
