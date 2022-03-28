"ui";

//变量初始化
var debug = true;
var ver = "0.6.2";
var err = 1;
var sys_lang = "en";
var thread_play_isAlive = 0;
var thread_credit_isAlive = 0;
var window = 1;
var main_status = 2;
var window_main;
var window_header;
var mouseTime;
var w_width = 430;
var w_height = 290;
var header_height = 60;
var sort = [];
var bg;
var background = [];

// 打乱背景图片顺序
for (var i = 1; i <= 21; i++) {
    sort.push(i);
}
// sort = sort.sort(function() { return .5 - Math.random(); }); //非完全打乱
for (let i = 1; i < sort.length; i++) {
    var rd = Math.floor(Math.random() * (i + 1));
    [sort[i], sort[rd]] = [sort[rd], sort[i]];
}

for (let i of sort.slice(0, 3)) {
    bg = 'file://res/bg/' + i + '.png';
    background.push(bg);
}

//坐标转换
setScreenMetrics(device.width, device.height);

//界面
ui.statusBarColor("#FFC0CB");
ui.layout(
    <vertical bg="#ffffff" gravity="center_horizontal">
        <horizontal gravity="center_horizontal" bg="#FFC0CB">
            <text text="PRTS作战代理" h="100" textColor="#ffffff" textSize="40sp" gravity="center_horizontal|center_vertical" margin="1" />
        </horizontal>
        <horizontal gravity="center_vertical">
            <text id="start" w="400" h="200" textSize="60sp" line="2" margin="1" textStyle="bold" typeface="monospace" textColor="#FFC0CB" gravity="left_horizontal|center_vertical" />
        </horizontal>
        <horizontal gravity="center_vertical">
            <text id="use" w="400" h="200" textSize="60sp" line="2" margin="1" textStyle="bold" typeface="monospace" textColor="#FFC0CB" gravity="left_horizontal|center_vertical" />
        </horizontal>
        <horizontal gravity="center_vertical">
            <text id="info" w="400" h="200" textSize="60sp" line="2" margin="1" textStyle="bold" typeface="monospace" textColor="#FFC0CB" gravity="left_horizontal|center_vertical" />
        </horizontal>
        <vertical gravity="center_horizontal">
            <text id="ver" w="*" h="50" textSize="14sp" margin="1" textStyle="bold" typeface="monospace" textColor="#FFC0CB" gravity="center_horizontal|bottom" />
            <text id="blog" w="*" h="auto" text="Modified by 逆熵之光" textSize="14sp" margin="1" textStyle="bold" typeface="monospace" textColor="#FFC0CB" gravity="center_horizontal|top" />
        </vertical>
    </vertical>
);
ui.ver.setText(`当前版本： ${ver}`);
ui.start.setText(" 开\n 始");
ui.use.setText(" 说\n 明");
ui.info.setText(" 关\n 于");

// 选取随机背景图片
ui.start.attr("bg", background[0]);
ui.use.attr("bg", background[1]);
ui.info.attr("bg", background[2]);

function change_main_status() {
    main_status = (main_status + 1) % 2;
    window_header.setSize(w_width, main_status * header_height + 1);
    window_header.all.setAlpha(main_status * 0.7);
    window_main.setSize(w_width, main_status * w_height + 1);
    window_main.all.setAlpha(main_status * 0.85);
}

//界面按钮事件
ui.start.click(() => {
    if (main_status == 2) {
        ui.start.setText(" 关\n 闭");
        threads.start(function () { main(); });
        main_status = 1;
    } else if (main_status == 1) {
        thread_stop();
        ui.start.setText(" 开\n 始");
        change_main_status();
    } else if (main_status == 0) {
        ui.start.setText(" 关\n 闭");
        change_main_status();
    }
});
ui.use.click(() => {
    threads.start(function () {
        alert("使用说明", "【权限说明】\n\
（点击开始会自动弹出需要的权限窗口）\n\
1. 打开悬浮窗权限\n\
2. 打开无障碍服务\n\
3. 同意截取屏幕\n\n\
【功能说明】\n\
1. 点悬浮窗上侧的深灰色横条可以显示或隐藏悬浮窗；\n\
2.「+」号和「-」用于设置关卡代理作战次数，在关卡界面点击「开始」，理智不足时不会自动吃药；\n\
4.「信用」用于自动收取；\n\n\
☆【注意：按音量上键会退出软件】☆");
    });
});
ui.info.click(() => {
    threads.start(function () {
        alert("关于", "1.本软件使用Auto.js开发，不盈利；\n\
2.不读取任何游戏数据；\n\
3.原作者：韭菜饺子QwQ（现B站ID：蹦蹦炸弹Pro）\n\
主页：https://space.bilibili.com/3157662\n\
4.修改者：逆熵之光\n\
主页：https://space.bilibili.com/12294062 \n\n\
修改内容为：\n\
1.优化自动代理作战的流程。\n\
2.将自动收取任务奖励改为自动收取信用。\n");
    });
});
ui.blog.click(() => {
    app.openUrl("https://space.bilibili.com/12294062");
});

//主程序
function main() {
    //请求截图权限
    if (requestScreenCapture(true)) {
        toast("请求截图成功")
        setTimeout(function () {
            //延迟2s，启动明日方舟
            switch (sys_lang) {
                case "en":
                    app.launchApp("arknights-taptap-308"); // 英文系统
                    break;
                default:
                    app.launchApp("明日方舟"); // 中文系统
            }
        }, 2000)
    } else {
        toast("请求截图失败");
        exit();
    }

    //无障碍服务判断
    if (auto.service == null) {
        toast("请打开无障碍服务");
        sleep(2000);
        auto.waitFor();
    } else {
        toast("无障碍服务已打开");
    }

    //缩小放大界面
    window_header = floaty.rawWindow(
        <horizontal id="all" bg="#000000" alpha="0.7" gravity="center_horizontal|center_vertical">
            <text id="title" w="385" text="当前没有操作" textSize="14sp" textColor="#ffffff" gravity="center_horizontal|center_vertical" />
        </horizontal>
    );
    window_header.setTouchable(true);
    window_header.setPosition(0, 150);
    window_header.setSize(w_width, header_height);
    setInterval(() => { }, 2000);

    //悬浮窗界面
    window_main = floaty.rawWindow(
        <vertical id="all" gravity="center_horizontal|center_vertical" bg="#696969" alpha="0.85">
            <horizontal gravity="center_horizontal|center_vertical">
                <button id="subtract" w="53" h="35" text="-" textSize="13sp" gravity="center_horizontal|center_vertical" />
                <text id="num" w="50" h="35" text="0" textSize="14sp" textColor="#ffffff" gravity="center_horizontal|center_vertical" />
                <button id="add" w="53" h="35" text="+" textSize="13sp" gravity="center_horizontal|center_vertical" />
            </horizontal>
            <horizontal gravity="center_horizontal|center_vertical">
                <vertical gravity="center_horizontal|center_vertical" w="78">
                    <button id="b_start" h="35" text="开始" textSize="13sp" gravity="center_horizontal|center_vertical" />
                    <button id="b_credit" h="35" text="信用" textSize="13sp" gravity="center_horizontal|center_vertical" />
                </vertical>
                <vertical gravity="center_horizontal|center_vertical" w="78">
                    <button id="b_stop" h="70" text="停止" textSize="20sp" gravity="center_horizontal|center_vertical" />
                </vertical>
            </horizontal>
        </vertical>
    );
    window_main.setTouchable(true);
    window_main.setPosition(0, window_header.getY() + header_height);
    window_main.setSize(w_width, w_height);
    //floaty_window.exitOnClose();
    setInterval(() => { }, 2000);

    //按钮事件
    window_main.b_start.click(() => { start_play(); });
    window_main.b_stop.click(() => { thread_stop(); });
    window_main.b_credit.click(() => { start_credit(); });
    window_main.add.on("touch_down", () => {
        var i = 0; //变量i
        mouseTime = setInterval(function () {  //setInterval可一直执行内部函数
            num_add();
            i++  //若过一秒，执行一次i++
        }, 100);
        if (i == 0) {  //i=0时证明无长按事件为单击事件
            num_add();
        }
    });
    window_main.add.on("touch_up", () => { clearInterval(mouseTime); });
    window_main.subtract.on("touch_down", () => {
        var i = 0; //变量i
        mouseTime = setInterval(function () {  //setInterval可一直执行内部函数
            num_subtract();
            i++  //若过100ms，执行一次i++
        }, 100);
        if (i == 0) {  //i=0时证明无长按事件为单击事件
            num_subtract();
        }
    });
    window_main.subtract.on("touch_up", () => { clearInterval(mouseTime); });

    window_header.title.on('click', () => {
        ui.run(() => {
            set_window_status((window + 1) % 2);
        });
    });

    // 悬浮窗拖动
    var position;
    window_header.title.on('touch', (e) => {
        position = [window_header.x - e.getRawX(), window_header.y - e.getRawY()];
    });
    window_header.title.on('touch_move', (e) => {
        let [x, y] = position;
        window_header.setPosition(x + e.getRawX(), y + e.getRawY());
        window_main.setPosition(x + e.getRawX(), y + e.getRawY() + header_height);
    });
}

//加号
function num_add() {
    if (thread_play_isAlive == 0) {
        var i;
        i = window_main.num.getText();
        i++;
        window_main.num.setText(i.toString());
    }
}

//减号
function num_subtract() {
    if (thread_play_isAlive == 0) {
        var i;
        i = window_main.num.getText();
        if (i > 0) {
            i--;
            window_main.num.setText(i.toString());
        }
    }
}

//开始代理线程
function start_play() {
    var num = window_main.num.getText();
    if (thread_play_isAlive + thread_credit_isAlive == 0) {
        threads.start(function () {
            play(num);
        });
    }
    else {
        threads.start(function () { toast("正在进行其他操作"); });
    }
}

//开始领取信用线程
function start_credit() {
    if (thread_play_isAlive + thread_credit_isAlive == 0) {
        threads.start(function () {
            credit();
        });
    }
    else {
        threads.start(function () { toast("正在进行其他操作"); });
    }
}

//停止所有线程
function thread_stop() {
    threads.shutDownAll();
    thread_play_isAlive = 0;
    thread_credit_isAlive = 0;
    window_main.num.setText("0");

    if (err <= 5) {
        window_header.title.setText("当前没有操作");
    } else if (err > 5) {
        window_header.title.setText("自动代理出现失误");
    }
    err = 1;
}

//隐藏、显示菜单
function set_window_status(status) { // 0为隐藏，1为显示
    window = status;
    window_main.setSize(w_width, status * w_height + 1);
    window_main.all.setAlpha(status * 0.85);
}

//返回首页
function back2main() {
    var p_back, p_geer;
    var img_back = images.read("res/img/返回.jpg");
    var img_geer = images.read("res/img/首页齿轮.jpg");
    while (true) {
        p_back = images.findImage(captureScreen(), img_back);
        if (p_back) {
            click(p_back.x + 30, p_back.y + 30);
        } else {
            p_geer = images.findImage(captureScreen(), img_geer);
            if (p_geer) { break; }
        }
        sleep(500);
    }
    img_back.recycle();
    img_geer.recycle();
}

function wait_until_findImg(img, img_name, config) {
    err = 1;
    // initialize configuration parameters.
    var config = (config === undefined) ? {} : config;
    var delta_time = (config.delta_time === undefined) ? 1000 : config.delta_time;
    var max_time = (config.max_time === undefined) ? 10 * 1000 : config.max_time;
    var wait_click = (config.wait_click === undefined) ? false : config.wait_click;
    var final_click = (config.final_click === undefined) ? true : config.final_click;
    var click_delay = (config.click_delay === undefined) ? 1000 : config.click_delay;
    var bias = (config.click_bias === undefined) ? { x: 20, y: 20 } : config.click_bias;
    var end_delay = (config.end_delay === undefined) ? 0 : config.end_delay;
    var verbose = (config.verbose === undefined) ? false : config.verbose;
    var p;
    if (verbose) {
        window_header.title.setText(`等待${img_name}`);
    }
    while (true) {
        p = images.findImage(captureScreen(), img);
        // sleep(100);
        if (p) {
            if (final_click) {
                sleep(click_delay);
                click(p.x + bias.x, p.y + bias.y);
            }
            break;
        } else {
            if (wait_click) { click(600, 250); }
            sleep(delta_time);
            max_time -= delta_time;
            // console.log(max_time);
            if (max_time < 0) {
                err = 10;
                window_header.title.setText(`未检测到${img_name}`);
                sleep(1000);
                return 0;
            }
        }
    }
    sleep(end_delay);
    return p;
}

//点击api
/**
 * @description 点击img1，直到检测到img2
 * @param {image} img1 需要点击的图片
 * @param {image} img2 用于判断是否已经点击img1，跳转到img2
 * @param {string} img1_name img1的名称
 * @param {string} img2_name img2的名称
 * @param {object} [config={ }] 一些可选参数
 * @param {object} [config.click_bias={ x: 15, y: 15 }]  点击时相对于检测图片左上角的偏移量（像素）
 * @param {number} [config.delta_t=500]  一次点击之后，正常情况下跳转到下一个界面的等待时间
 * @param {number} [config.end_delay=0]  本次点击完全结束后，直到开始下一个点击事件的延迟时间
 * @param {boolean} [config.verbose=false] 是否将点击时间显示在悬浮窗的深灰色横条上
 * @return void
 */
function clickImg1_until_findImg2(img1, img2, img1_name, img2_name, config) {
    err = 1;
    // initialize configuration parameters.
    var config = (config === undefined) ? {} : config;
    var bias = (config.click_bias === undefined) ? { x: 15, y: 15 } : config.click_bias;
    var delta_t = (config.delta_t === undefined) ? 1000 : config.delta_t;
    var end_delay = (config.end_delay === undefined) ? 0 : config.end_delay;
    var verbose = (config.verbose === undefined) ? false : config.verbose;

    if (verbose) {
        window_header.title.setText(`点击${img1_name}`);
    }
    var p1, p2;
    while (true) {
        p1 = images.findImage(captureScreen(), img1); // 第一个图
        sleep(100);
        if (p1) {
            click(p1.x + bias.x, p1.y + bias.y);
        } else {
            p2 = images.findImage(captureScreen(), img2); // 第二个图
            sleep(100);
            if (p2) {
                break;
            }
        }
        if (err > 5) {
            window_header.title.setText(`未检测到${img2_name}`);
            sleep(1000);
            return 0;
        } else {
            err++;
        }
        sleep(delta_t);
    }
    if (end_delay) { sleep(end_delay); }
    if (p2) { return p2; }
}

function watchImg1_until_clickImg2(img1, img2, img1_name, img2_name, config) {
    err = 1;
    // initialize configuration parameters.
    var config = (config === undefined) ? {} : config;
    var bias = (config.click_bias === undefined) ? { x: 15, y: 15 } : config.click_bias;
    var delta_t = (config.delta_t === undefined) ? 2000 : config.delta_t;
    var click_delay = (config.click_delay === undefined) ? 1500 : config.click_delay;
    var end_delay = (config.end_delay === undefined) ? 2500 : config.end_delay;
    var verbose = (config.verbose === undefined) ? false : config.verbose;

    var p1, p2;
    if (verbose) {
        window_header.title.setText(`正在检测${img1_name}`);
    }
    while (true) {
        p1 = images.findImage(captureScreen(), img1); // 第一个图
        if (p1) { sleep(delta_t); } else { break; }
    }

    if (verbose) {
        window_header.title.setText(`正在检测${img2_name}`);
    }
    while (true) {
        sleep(click_delay);
        p2 = images.findImage(captureScreen(), img2); // 第二个图
        if (p2) {
            click(p2.x + bias.x, p2.y + bias.y);
            break;
        } else {
            click(100, 100);
        }
    }
    if (end_delay) { sleep(end_delay); }
}

function watchImg(img, img_name, config) {
    var config = (config === undefined) ? {} : config;
    var delta_t = (config.delta_t === undefined) ? 3000 : config.delta_t;
    var verbose = (config.verbose === undefined) ? false : config.verbose;

    var p;
    if (verbose) {
        window_header.title.setText(`正在检测${img_name}`);
    }
    while (true) {
        p = images.findImage(captureScreen(), img); // 第一个图
        if (p) { sleep(delta_t); } else { break; }
    }
}

// 检查关卡
function check_function(img, func_name) {
    var p = images.findImage(captureScreen(), img);
    sleep(100);
    if (p) {
        window_header.title.setText(`正常${func_name}`);
        sleep(1000);
        ui.run(() => {
            set_window_status(0); // 隐藏菜单
        })
    } else {
        window_header.title.setText(`无法${func_name}`);
        sleep(1000);
        thread_stop();
        sleep(200);
    }
}

//代理线程
function play(num) {
    err = 1;
    thread_play_isAlive = 1;

    // 读取图片
    var img_start_blue = images.read("res/img/开始行动蓝.jpg");
    var img_start_red = images.read("res/img/开始行动红.jpg");
    var img_takeover = images.read("res/img/接管作战.jpg");
    var img_cost = images.read("res/img/cost.jpg");
    var img_over = images.read("res/img/行动结束.jpg");

    var p_red;

    var b_mode = device.getBrightnessMode();
    var b = device.getBrightness();
    device.setBrightnessMode(0); // 亮度设为手动模式

    check_function(img_start_blue, "识别关卡");

    for (var i = 1; i <= num; i++) {
        p_red = clickImg1_until_findImg2(img_start_blue, img_start_red, "开始行动", "红色开始行动",
            config = {
                verbose: true
            });
        if (err > 5) { break; }

        click(p_red.x + 30, p_red.y); //点击红色开始行动按钮

        window_header.title.setText(`当前第${i}次代理`);
        sleep(10 * 1000);  //延迟10s调整屏幕亮度
        if (i == 1) {
            device.setBrightness(Math.min(50, b / 2));
        }
        sleep(50 * 1000);  // 延迟60s开始检测是否结束战斗

        watchImg(img_takeover, "接管作战");
        watchImg(img_cost, "cost");  // 避免中途出现作战失败，导致检测不到接管作战

        // 等待行动结束出现，等待过程中点击屏幕
        wait_until_findImg(img_over, "行动结束",
            config = {
                wait_click: true,
                click_delay: 4000
            });
        if (err > 5) { break; }

        // watchImg1_until_clickImg2(img_cost, img_over, "费用", "行动结束");

        // 等待蓝色开始按钮出现
        wait_until_findImg(img_start_blue, "蓝色开始行动",
            config = {
                final_click: false
            });
        if (err > 5) { break; }
    }
    // 回收所有图片
    img_start_blue.recycle();
    img_start_red.recycle();
    img_takeover.recycle();
    img_cost.recycle();
    img_over.recycle();

    device.setBrightness(b);  //恢复原始亮度
    device.setBrightnessMode(b_mode);  //恢复原始亮度模式
    ui.run(() => {
        set_window_status(1);
    })

    thread_stop();
}

//领取信用
function credit() {
    err = 1;
    thread_credit_isAlive = 1;
    window_header.title.setText("检测是否首页");
    back2main();

    var img_main_friend = images.read("res/img/首页好友.jpg");
    var img_friend_list_grey = images.read("res/img/好友列表黑.jpg");
    var img_friend_list_white = images.read("res/img/好友列表白.jpg");
    var img_visit_construction = images.read("res/img/访问基建.jpg");
    var img_enter_construction = images.read("res/img/进入基建.jpg");
    var img_next_orange = images.read("res/img/访问下位橙.jpg");
    // var img_next_grey = images.read("res/img/访问下位灰.jpg");

    window_header.title.setText("正在领取信用");
    ui.run(() => {
        set_window_status(0);
    })

    clickImg1_until_findImg2(img_main_friend, img_friend_list_grey, "首页好友");
    if (err > 5) {
        thread_stop();
        sleep(100);
    }

    clickImg1_until_findImg2(img_friend_list_grey, img_friend_list_white, "灰色好友列表");
    if (err > 5) {
        thread_stop();
        sleep(100);
    }

    clickImg1_until_findImg2(img_visit_construction, img_enter_construction, "访问基建");
    if (err > 5) {
        thread_stop();
        sleep(100);
    }

    wait_until_findImg(img_next_orange, "橙色访问下位", 
        config = {
            delta_time: 500
        });

    for (var i = 1; i <= 10; i++) {
        window_header.title.setText(`第${i}次领取`);
        wait_until_findImg(img_next_orange, "橙色访问下位",
            config = {
                bias: { x: 30, y: 30 },
                end_delay: 1500,
                max_time: 6 * 1000
            });
        if (err > 5) {
            break;
        }
    }

    img_main_friend.recycle();
    img_friend_list_grey.recycle();
    img_friend_list_white.recycle();
    img_visit_construction.recycle();
    img_enter_construction.recycle();
    img_next_orange.recycle();
    // img_next_grey.recycle();

    ui.run(() => {
        set_window_status(1);
    })
    if (err == 1) {
        window_header.title.setText("信用领取完成");
    }
    sleep(1000);
    thread_stop();
    sleep(200);
}
