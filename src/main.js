//
//  main.js
//  抢课助手
//
//  Created by 李弘辰 on 2021/6/24.
//  Copyright © 2021 李弘辰. All rights reserved.
//  Learn more on website https://void-lee.cn
//
//  This program is free software; you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation; either version 2 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License along
//  with this program; if not, write to the Free Software Foundation, Inc.,
//  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//

const pro_info = require("../package.json")
require("../lib/x0popup/x0popup_j.css")
const x0p = require("../lib/x0popup/x0popup_j.js")

window.onload = function() {
    console.log("%c" + pro_info.author + "抢课助手v" + pro_info.version,"color:red")

    const html = "<div style=\"background-color: black;height: 350px\">\n" +
        "    <style>\n" +
        "        h1 {\n" +
        "            color: white;\n" +
        "            margin: 0;\n" +
        "        }\n" +
        "\n" +
        "        select {\n" +
        "            /*width: 300px;*/\n" +
        "            border: 1px solid white;\n" +
        "            background-color: black;\n" +
        "            color: white;\n" +
        "            outline: none;\n" +
        "            height: 300px !important;\n" +
        "            display: block;\n" +
        "            padding: 5px 0 5px;\n" +
        "            margin: 0 5px 0 5px;\n" +
        "        }\n" +
        "\n" +
        "        #ok {\n" +
        "            display: flex;\n" +
        "            height: 300px;\n" +
        "            align-items: center;\n" +
        "        }\n" +
        "\n" +
        "        #button_domain {\n" +
        "            margin: 10px;\n" +
        "        }\n" +
        "\n" +
        "        .button_domain button {\n" +
        "            width: 100px;\n" +
        "            height: 50px;\n" +
        "            background-color: black;\n" +
        "            color: white;\n" +
        "            border: 1px white solid;\n" +
        "            cursor: pointer;\n" +
        "            display: block;\n" +
        "            margin: 5px;\n" +
        "        }\n" +
        "\n" +
        "        .button_domain button:hover {\n" +
        "            background-color: white;\n" +
        "            color: black;\n" +
        "        }\n" +
        "\n" +
        "        #inf {\n" +
        "            display: flex;\n" +
        "        }\n" +
        "    </style>\n" +
        "    <h1>void-lee抢课器</h1>\n" +
        "    <p style=\"color:#fff;\" id=\"load\">正在加载中。。。按f12查看详细情况。</p>\n" +
        "    <div id=\"ok\" style=\"display: none;\">\n" +
        "        <select id=\"cid\" multiple=\"multiple\" style=\"flex: 1;\"></select>\n" +
        "        <div id=\"inf\" class=\"button_domain\">\n" +
        "            <select id=\"jxb\" multiple=\"multiple\" style=\"width: 300px\"></select>\n" +
        "            <div style=\"overflow-y: scroll;width: 300px;color: white;height: 300px\"></div>\n" +
        "        </div>\n" +
        "        <span style=\"color: white\">&gt;&gt;</span>\n" +
        "        <select id=\"selected\" multiple=\"multiple\" style=\"flex: 1;\"></select>\n" +
        "        <div class=\"button_domain\">\n" +
        "            <button id=\"fetch\">一键抢课</button>\n" +
        "            <button id=\"stole\">捡漏</button>\n" +
        "            <button id=\"del\" style=\"display: none\">删除</button>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>"


    $('body').prepend(html)

    // TODO: 检查更新
    $.ajax({
        url: 'https://raw.githubusercontent.com/Void-JackLee/ZFCourseTakingAssistant/main/package.json?ver=' + new Date().getTime(),
        dataType: 'json',
        async: true,
        method: 'get',
        success: (data) => {
            if (data.version !== pro_info.version) {
                const h1 = $('h1');
                h1.html(h1.html() + `<h5 style="font-size: 16px;display: inline;margin: 0">(检查到新版本v${data.version}：${data.newVersionDescription}[<a href='https://raw.githubusercontent.com/Void-JackLee/ZFCourseTakingAssistant/main/%E6%8A%A2%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js'>点此更新</a>])</h5>`);
            }
        }
    })

    setTimeout(run,0);
}

function run() {

    log('加载课程种类中...');
    window.type_class_data = fetchType();
    log('加载课程列表中...')
    // 所有教学班数量
    window.fuck_all = 0;
    // 数据
    window.fucking_data_courses = {};
    // 教学班id和课程码的映射
    window.fucking_map = {};
    // 教学班id和课程类型的数组
    window.fucking_type_arr = [];
    window.fuck_index = 1;

    hasNZero = false;
    $("#jspage").val('0');

    for (let i = 0;i < type_class_data.length;i ++) {
        log(i);

        // 初始化选课类型
        let k = type_class_data[i];
        $("#kklxdm").val(k.kklxdm);
        $("#xkkz_id").val(k.xkkz_id);
        $("#njdm_id").val(k.njdm_id);
        $("#zyh_id").val(k.zyh_id);

        log(i);

        let tp = i;
        // 加载完成标志
        fuck_load_course_done = false;
        // 当前类型
        f_crt_type = tp;

        let load_course = loadCoursesByPaged.toString();
        // 获得函数体
        load_course = load_course.match(/{[\s\S]*}/)[0];
        load_course = load_course.substring(1,load_course.length - 2);
        // 修改请求课程数量
        load_course = load_course.replace(/var\s+step\s*=\s*.*;/,'var step = 100;\n' +
            '\n' +
            '$("#jspage").val("0");\n' +
            '$("#isEnd").val("false");\n'); // 强制加载
        // patch第二次循环的时候一定要删掉
        if ($("#jspage").val() != "0")
        {
            hasNZero = true;
        }
        if (hasNZero) load_course = load_course.replace(/if\s*\(\s*jspage\s*==\s*"0"\s*\)/g,'if(jspage=="-1")')

        // 增加数据变量
        //load_course = load_course.replace(/var\s+data\s*=[\s\S]*?;/,load_course.match(/var\s+data\s*=[\s\S]*?;/)[0] + '\nconsole.log(data);');
        // 注入id
        load_course = load_course.replace(/s_html[^\n]*?onclick[\s\S]*?loadJxbxxZzxk[\s\S]*?;/,'s_html.push(" onclick=\'loadJxbxxZzxk(this)\' id=\'fucking_obj_" + fuck_index + "\'>");\n' +
            'fuck_index ++;\n' +
            'fucking_type_arr.push(f_crt_type);\n');
        // 提取数据
        load_course = load_course.replace(/l_jxbid\s*=\s*mdA[\s\S]*?;/,load_course.match(/l_jxbid\s*=\s*mdA[\s\S]*?;/)[0] + '\n' +
            'if (fucking_data_courses[mdA.kch] === undefined) fucking_data_courses[mdA.kch] = {};\n' +
            'fucking_data_courses[mdA.kch]["course_name"] = mdA.kcmc;\n' +
            'fucking_data_courses[mdA.kch][mdA.jxb_id] = {class_name:mdA.jxbmc};\n' +
            'fucking_map[mdA.jxb_id] = mdA.kch;\n' +
            'fuck_all ++;');
        // 增加加载完成标志
        load_course = load_course.replace(/}\s*,\s*'json'\s*\)\s*;/,'fuck_load_course_done = true;\n' + '},\'json\');');
        // 不要自动加载第一个
        load_course = load_course.replace(/\$[^\n]*?kc_head[^\n]*?click[^\n]*?;/,'');

        // 修改变量使得选课按钮可用
        $("#sfkxk").val("1");
        $("#jzxkf").val("0");
        $("#isinxksj").val("1");

        // 执行
        eval(load_course);

        log(i);
    }

    log('加载每一门课程详细教学班中...');

    let data = loadEverySingleCourse();

    log('--------------------全部加载完成-----------------------');

    let course_type = [];
    let mode = 0;

    let current_type = 0;
    let course_children = [];
    let qurey_index_course = 0;

    window.take = {};
    let back = {};

    setTimeout(function () {
        display(data)
    },100);


    function log(str) {
        console.log(str)
    }

    function fetchType() {
        let type_class_data = [];
        let a = $("#nav_tab").find("li a");
        let x,s,ii;
        if (a.length === 0) {
            // 修复只有一个标签不显示的情况
            x = {
                kklxdm: $('#kklxdm').val(),
                xkkz_id: $('#xkkz_id').val(),
                njdm_id: $('#njdm_id').val(),
                zyh_id: $('#zyh_id').val()
            };
            type_class_data.push(x);
        } else {
            for (let i in a) {
                x = {
                    kklxdm: '',
                    xkkz_id: '',
                    njdm_id: '',
                    zyh_id: ''
                };
                s = a[i].onclick;
                if (s === undefined || s === null) continue;

                s = s.toString().match(/queryCourse.*\)/)[0];
                ii = 0;
                for (let i in s) {
                    if (s[i] === "'") {
                        ii ++;
                    } else if (ii === 1) x.kklxdm += s[i];
                    else if (ii === 3) x.xkkz_id += s[i];
                    else if (ii === 5) x.njdm_id += s[i];
                    else if (ii === 7) x.zyh_id += s[i];
                }
                type_class_data[i] = x;
            }
        }

        return type_class_data;
    }

    function loadEverySingleCourse() {
        let load_single = loadJxbxxZzxk.toString();
        // 获得函数体
        load_single = load_single.match(/{[\s\S]*}/)[0];
        load_single = load_single.substring(1,load_single.length - 2);
        // 根据id赋值，添加占位符
        load_single = 'var obj = $;\n' + load_single;
        // 添加type占位符
        load_single = 'var fuck_type_id = $;\n' + load_single;
        // 强制显示抢课按钮
        load_single = load_single.replace(/var\s+jxb_ids\s+=\s+\[];/,"var jxb_ids = [];\n" +
            "zcxkbj = \"1\";");
        // 关闭动画，避免卡顿
        load_single = load_single.replace(/showHideJxb\s*\(\s*obj\s*\)\s*;/g,'');


        // 修改界面，更好玩
        load_single = load_single.replace(/trObj[^\n]*?td.an[\s\S]*?\);/,'trObj.find("td.an").html("<button type=\'button\' class=\'btn btn-primary btn-sm\' onclick=chooseCourseZzxk(\'"+m_jxb_id+"\',\'"+m_do_jxb_id+"\',\'"+kch_id+"\',\'"+m_jxbzls+"\')>"+ "注入选课" +"</button>");');
        // 获取每一门课程数据
        load_single = load_single.replace(/var\s+m_do_jxb_id[\s\S]*?;/,load_single.match(/var\s+m_do_jxb_id[\s\S]*?;/)[0] + '\n' +
            'let fuck_single_ = fucking_data_courses[fucking_map[m_jxb_id]][m_jxb_id];\n' +
            'fuck_single_["jxbrs"] = m_jxbrs;\n' +
            'fuck_single_["meta"] = {m_jxb_id:m_jxb_id,m_do_jxb_id:m_do_jxb_id,kch_id:kch_id,m_jxbzls:m_jxbzls,course_type:fuck_type_id};\n' +
            'fuck_crt ++;');
        // 获得信息
        let data_str = load_single.match(/convertID[\s\n]*?\([^\n]*?\.jxb_id/)[0];
        let data_str_del_length = data_str.match(/convertID[\s\n]*?\(/)[0].length;
        data_str = data_str.substr(data_str_del_length,data_str.length - data_str_del_length).trim();
        data_str = data_str.substr(0,data_str.length - 6);

        load_single = load_single.replace(/for[\s\n]*?\([\s\n]*?var[\s\n]+?i[\s\n]*?=[\s\n]*?0[\s\n]*?;[\s\n]*?i[\s\n]*?<[\s\n]*?data[\s\n]*?.[\s\n]*?length[\s\n]*?;[\s\n]*?i[\s\n]*?\+\+[\s\n]*?\)[\s\n]*?{/, load_single.match(/for[\s\n]*?\([\s\n]*?var[\s\n]+?i[\s\n]*?=[\s\n]*?0[\s\n]*?;[\s\n]*?i[\s\n]*?<[\s\n]*?data[\s\n]*?.[\s\n]*?length[\s\n]*?;[\s\n]*?i[\s\n]*?\+\+[\s\n]*?\)[\s\n]*?{/)[0] +
            '\nlet fuck_single = fucking_data_courses[fucking_map[' + data_str + 'jxb_id]][' + data_str + 'jxb_id];\n' +
            'fuck_single.jsxx = ' + data_str + 'jsxx;\n' +
            'fuck_single.jxbrl = ' + data_str + 'jxbrl;\n' +
            'fuck_single.jxdd = ' + data_str + 'jxdd;\n' +
            'fuck_single.kcgsmc = ' + data_str + 'kcgsmc;\n' +
            'fuck_single.kcxzmc = ' + data_str + 'kcxzmc;\n' +
            'fuck_single.sksj = ' + data_str + 'sksj;\n' +
            'fuck_single.xqumc = ' + data_str + 'xqumc;\n' +
            '//console.log(fuck_type_id);\n'); // TODO : add type

        load_single = load_single.replace(/if[\s\n]*?\([\s\n]*?czzt[\s\n]*?==[\s\n]*?"0"[\s\n]*?\)[\s\n]*?{/,'if (true) {');
        // 已加载的数量
        fuck_crt = 0;


        function load_single_course(id,num) {
            // 修改obj的值
            load_single = load_single.replace(/var obj = [\S\s]*?;/,'var obj = document.getElementById("' + id +  '");');
            load_single = load_single.replace(/var fuck_type_id = [\S\s]*?;/,'var fuck_type_id = fucking_type_arr[' + (parseInt(num) - 1) + '];');
            // 提供对应的id
            let k = type_class_data[fucking_type_arr[(parseInt(num) - 1)]];
            $("#kklxdm").val(k.kklxdm);
            $("#xkkz_id").val(k.xkkz_id);
            $("#njdm_id").val(k.njdm_id);
            $("#zyh_id").val(k.zyh_id);
            // 执行
            eval(load_single);
        }

        // console.log(fucking_type_arr)

        // 遍历加载
        for (let i = 1;i < fuck_index;i ++)
        {
            console.log(fucking_type_arr[(parseInt(i) - 1)]);
            load_single_course('fucking_obj_' + i,i);
        }

        return fucking_data_courses;
    }

    function display(data) {
        console.log(data)
        for (let i in data) {
            ok = true;
            for (let j in data[i]) {
                if (j == 'course_name') continue;
                ok &= (data[i][j]['jxbrl'] == data[i][j]['jxbrs']);
            }
            $('#cid').append(`<option value="${i}" style="color: ${ok ? 'red' : 'white'}">${i}&nbsp;&nbsp;&nbsp;${data[i].course_name}</option>`)
        }
        $('#cid').change(function() {
            val = $(this).val();
            $('#jxb').html('');

            for (let i in data[val]) {
                if (i === 'course_name') continue;
                $('#jxb').append(`<option style="color: ${data[val][i]['jxbrl'] == data[val][i]['jxbrs'] ? 'red' : 'white'}" value='${JSON.stringify(data[val][i])}'>${data[val][i].class_name}</option>`)
            }
        });

        $('#jxb').change(function () {
            val = $(this).val();
            obj_course = JSON.parse(val);
            con = `<style>span{display: block}</style><button class='addd' value='${val}'>添加</button>`
            con += `<span>教学班名称: ${obj_course.class_name}</span>`;
            con += `<span>老师: ${obj_course.jsxx}</span>`;
            con += `<span>当前人数: ${obj_course.jxbrs}</span>`;
            con += `<span>容量: ${obj_course.jxbrl}</span>`;
            con += `<span>教室: ${obj_course.jxdd}</span>`;
            //console.log('教学模式: ',obj_course.jxms);
            con += `<span>类别: ${obj_course.kcgsmc}</span>`;
            con += `<span>课程类型: ${obj_course.kcxzmc}</span>`;
            con += `<span style="font-weight: bold">上课时间: ${obj_course.sksj}</span>`;
            con += `<span>校区: ${obj_course.xqumc}</span>`;
            con += `<span>jxb_id: ${obj_course.meta.m_jxb_id}</span>`;
            con += `<span>---课程内部信息---</span>`;
            con += `<span>do_jxb_id: ${obj_course.meta.m_do_jxb_id}</span>`;
            con += `<span>kch_id: ${obj_course.meta.kch_id}</span>`;
            con += `<span>jxbzls: ${obj_course.meta.m_jxbzls}</span>`;
            con += `<span>选课类型: ${obj_course.meta.course_type}</span>`;
            $('#inf div').html(con)

            $('.addd').click(function () {
                val = $(this).val();
                obj_course = JSON.parse(val);
                id = `_${new Date().getTime()}`
                $('#selected').append(`<option id="${id}" onclick="addOptionListener(this)">${obj_course.class_name}</option>`)
                take[id] = obj_course.meta;
            })

        })


        $('#fetch').click(take_course);
        $('#stole').click(function () {
            x0p({
                title: "挂机",
                text: "请输入间隔毫秒数(不填默认100ms)",
                type: "input",
                height: "200px",
                maxHeight: "200px",
                icon: "ok",
                inputPromise: function(button, value) {
                    let p = new Promise(function(resolve, reject) {
                        if(isNaN(value)) resolve('这不是一个数字');
                        resolve(null);
                    });
                    return p;
                },
                buttons: [{
                    type: 'cancel',
                    text: '取消',
                },
                {
                    type: 'ok',
                    text: '确定',
                    showLoading: true,
                    default: true,
                    key: 13
                }]
            }).then(function (data) {
                if (data.button === 'ok') {
                    if (data.text == undefined || data.text == null || data.text == '') data.text = '100';
                    let t = parseInt(data.text);
                    setInterval(take_course,t);
                    x0p('成功','目前无法自动停止，若要停止请刷新页面','ok');
                }
            });

        });
    }


    function take_course() {
        for (let i in take)
        {
            let k = type_class_data[take[i].course_type];
            $("#kklxdm").val(k.kklxdm);
            $("#xkkz_id").val(k.xkkz_id);
            $("#njdm_id").val(k.njdm_id);
            $("#zyh_id").val(k.zyh_id);
            chooseCourseZzxk(take[i].m_jxb_id,take[i].m_do_jxb_id,take[i].kch_id,take[i].m_jxbzls);
            // console.log('chooseCourseZzxk("'+take[i].m_jxb_id+'","'+take[i].m_do_jxb_id+'","'+take[i].kch_id+'","'+take[i].m_jxbzls+'");');
        }
    }


    $('#load').css('display','none');
    $('#ok').css('display','flex');
}

window.addOptionListener = function addOptionListener(e) {
    cur = $(e).attr('id');
    // console.log(cur)
    $('#del').css('display','block').click(function () {
        $('#' + cur).remove();
        delete take[cur];
        $('#del').css('display','none');
    });
}