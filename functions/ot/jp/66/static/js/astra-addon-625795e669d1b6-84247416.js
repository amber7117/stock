astraToggleSetupPro = function(e, a, t) {
    var l, o;
    if (0 < (o = "off-canvas" === e || "full-width" === e ? (l = document.querySelectorAll("#ast-mobile-popup, #ast-mobile-header"),
    a.classList.contains("ast-header-break-point") ? document.querySelectorAll("#ast-mobile-header .main-header-menu-toggle") : document.querySelectorAll("#ast-desktop-header .main-header-menu-toggle")) : a.classList.contains("ast-header-break-point") ? (l = document.querySelectorAll("#ast-mobile-header"),
    document.querySelectorAll("#ast-mobile-header .main-header-menu-toggle")) : (l = document.querySelectorAll("#ast-desktop-header"),
    document.querySelectorAll("#ast-desktop-header .main-header-menu-toggle"))).length)
        for (var n = 0; n < o.length; n++)
            if (o[n].setAttribute("data-index", n),
            t[n] || (t[n] = o[n],
            o[n].addEventListener("click", astraNavMenuToggle, !1)),
            void 0 !== l[n])
                for (var r, s = 0; s < l.length; s++)
                    if (0 < (r = document.querySelector("header.site-header").classList.contains("ast-builder-menu-toggle-link") ? l[s].querySelectorAll("ul.main-header-menu .menu-item-has-children > .menu-link, ul.main-header-menu .ast-menu-toggle") : l[s].querySelectorAll("ul.main-header-menu .ast-menu-toggle")).length)
                        for (var d = 0; d < r.length; d++)
                            r[d].addEventListener("click", AstraToggleSubMenu, !1)
}
,
astraNavMenuTogglePro = function(e, a, g, t) {
    e.preventDefault();
    var l = e.target.closest("#ast-desktop-header")
      , o = document.querySelector("#masthead > #ast-desktop-header .ast-desktop-header-content")
      , n = (l = null != l && "" !== l ? l.querySelector(".main-header-menu-toggle") : document.querySelector("#masthead > #ast-desktop-header .main-header-menu-toggle"),
    document.querySelector("#masthead > #ast-desktop-header .ast-desktop-header-content .main-header-bar-navigation"));
    if ("desktop" === e.currentTarget.trigger_type)
        return null !== n && "" !== n && void 0 !== n && (astraToggleClass(n, "toggle-on"),
        n.classList.contains("toggle-on") ? n.style.display = "block" : n.style.display = ""),
        astraToggleClass(l, "toggled"),
        void (l.classList.contains("toggled") ? (a.classList.add("ast-main-header-nav-open"),
        "dropdown" === g && (o.style.display = "block")) : (a.classList.remove("ast-main-header-nav-open"),
        o.style.display = "none"));
    e = document.querySelectorAll("#masthead > #ast-mobile-header .main-header-bar-navigation"),
    menu_toggle_all = document.querySelectorAll("#masthead > #ast-mobile-header .main-header-menu-toggle"),
    n = "0",
    l = !1;
    if (null !== t.closest("#ast-fixed-header") && (e = document.querySelectorAll("#ast-fixed-header > #ast-mobile-header .main-header-bar-navigation"),
    menu_toggle_all = document.querySelectorAll("#ast-fixed-header .main-header-menu-toggle"),
    n = "0",
    l = !0),
    void 0 === e[n])
        return !1;
    for (var r = e[n].querySelectorAll(".menu-item-has-children"), s = 0; s < r.length; s++) {
        r[s].classList.remove("ast-submenu-expanded");
        for (var d = r[s].querySelectorAll(".sub-menu"), i = 0; i < d.length; i++)
            d[i].style.display = "none"
    }
    -1 !== (t.getAttribute("class") || "").indexOf("main-header-menu-toggle") && (astraToggleClass(e[n], "toggle-on"),
    astraToggleClass(menu_toggle_all[n], "toggled"),
    l && 1 < menu_toggle_all.length && astraToggleClass(menu_toggle_all[1], "toggled"),
    e[n].classList.contains("toggle-on") ? (e[n].style.display = "block",
    a.classList.add("ast-main-header-nav-open")) : (e[n].style.display = "",
    a.classList.remove("ast-main-header-nav-open")))
}
;
!function() {
    var e, t;
    function o(e) {
        var t = (t = document.body.className).replace(e, "");
        document.body.className = t
    }
    function d(e) {
        e.style.display = "block",
        setTimeout(function() {
            e.style.opacity = 1
        }, 1)
    }
    function n(e) {
        e.style.opacity = "",
        setTimeout(function() {
            e.style.display = ""
        }, 200)
    }
    e = "iPhone" == navigator.userAgent.match(/iPhone/i) ? "iphone" : "",
    t = "iPod" == navigator.userAgent.match(/iPod/i) ? "ipod" : "",
    document.body.className += " " + e,
    document.body.className += " " + t;
    for (var a = document.querySelectorAll("a.astra-search-icon:not(.slide-search)"), s = 0; a.length > s; s++)
        a[s].onclick = function(e) {
            var t, a, o, n;
            if (e.preventDefault(),
            e = e || window.event,
            this.classList.contains("header-cover"))
                for (var s = document.querySelectorAll(".ast-search-box.header-cover"), c = astraAddon.is_header_builder_active || !1, r = 0; r < s.length; r++)
                    for (var l = s[r].parentNode.querySelectorAll("a.astra-search-icon"), i = 0; i < l.length; i++)
                        l[i] == this && (d(s[r]),
                        s[r].querySelector("input.search-field").focus(),
                        c ? (t = s[r],
                        n = o = a = void 0,
                        document.body.classList.contains("ast-header-break-point") && (n = document.querySelector(".main-navigation"),
                        a = document.querySelector(".main-header-bar"),
                        o = document.querySelector(".ast-mobile-header-wrap"),
                        null !== a && null !== n && (n = n.offsetHeight,
                        a = a.offsetHeight,
                        o = o.offsetHeight,
                        n = n && !document.body.classList.contains("ast-no-toggle-menu-enable") ? parseFloat(n) - parseFloat(a) : parseFloat(a),
                        t.parentNode.classList.contains("ast-mobile-header-wrap") && (n = parseFloat(o)),
                        t.style.maxHeight = Math.abs(n) + "px"))) : (a = s[r],
                        t = o = void 0,
                        document.body.classList.contains("ast-header-break-point") && (t = document.querySelector(".main-navigation"),
                        null !== (o = document.querySelector(".main-header-bar")) && null !== t && (t = t.offsetHeight,
                        o = o.offsetHeight,
                        t = t && !document.body.classList.contains("ast-no-toggle-menu-enable") ? parseFloat(t) - parseFloat(o) : parseFloat(o),
                        a.style.maxHeight = Math.abs(t) + "px"))));
            else
                !this.classList.contains("full-screen") || (e = document.getElementById("ast-seach-full-screen-form")).classList.contains("full-screen") && (d(e),
                document.body.className += " full-screen",
                e.querySelector("input.search-field").focus())
        }
        ;
    for (var c = document.querySelectorAll(".ast-search-box .close"), s = 0, r = c.length; s < r; ++s)
        c[s].onclick = function(e) {
            e = e || window.event;
            for (var t = this; ; ) {
                if (t.parentNode.classList.contains("ast-search-box")) {
                    n(t.parentNode),
                    o("full-screen");
                    break
                }
                if (t.parentNode.classList.contains("site-header"))
                    break;
                t = t.parentNode
            }
        }
        ;
    document.onkeydown = function(e) {
        if (27 == e.keyCode)
            for (var e = document.getElementById("ast-seach-full-screen-form"), t = (null != e && (n(e),
            o("full-screen")),
            document.querySelectorAll(".ast-search-box.header-cover")), a = 0; a < t.length; a++)
                n(t[a])
    }
    ,
    window.addEventListener("resize", function() {
        if ("BODY" === document.activeElement.tagName && "INPUT" != document.activeElement.tagName) {
            var e = document.querySelectorAll(".ast-search-box.header-cover");
            if (!document.body.classList.contains("ast-header-break-point"))
                for (var t = 0; t < e.length; t++)
                    e[t].style.maxHeight = "",
                    e[t].style.opacity = "",
                    e[t].style.display = ""
        }
    })
}();
