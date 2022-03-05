function creat_window_header() {
    window_header = floaty.rawWindow(
        <horizontal bg="#000000" alpha="0.7" gravity="center_horizontal|center_vertical">
            <text id="title" w="385" text="当前没有操作" textSize="14sp" textColor="#ffffff" gravity="center_horizontal|center_vertical" />
        </horizontal>
    );
    setInterval(() => { }, 2000);
    window_header.setTouchable(true);
    window_header.setPosition(0, 150);
    window_header.setSize(w_width, 60);

    window_header.title.on('click', () => {
        ui.run(()=>{
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
        window_main.setPosition(x + e.getRawX(), y + e.getRawY() + 60);
    });

    return window_header;
}