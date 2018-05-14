// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import axios from 'axios'
import {HTTP} from '@/helpers/http'

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'
Vue.use(Element, { locale })

import App from './App'

var VueCookie = require('vue-cookie');
Vue.use(VueCookie);

Vue.config.productionTip = false;

Vue.mixin({
    data () {
        return {
            isLoading: false,
        }
    },
    methods: {
        log: function (msg) {
            console.log(msg)
        },
        request: function (action = null, data = null) {
            this.isLoading = true
            axios.request({
                method: 'post',
                url: 'http://genuine.localhost/api/',
                params: {
                    uid: this.$cookie.get('uid') || null,
                    sid: this.$cookie.get('sid') || null,
                    action: action,
                },
                data: data,
            })
            .then(response => {
                this.isLoading = false
                response.data.data.auth ? this.$root.store.login() : this.$root.store.logout()
                if (typeof response.data.data.data.perms != 'undefined') {
                    // save perms as obj for fast search
                    var perms = response.data.data.data.perms
                    for (var i = 0; i < perms.length; i++) {
                        var key = perms[i]
                        this.$root.store.perms[key] = true
                    }
                }
                if (!response.data.success && response.data.message != '') {
                    this.$message.error(response.data.message);
                }
                if (response.data.success && response.data.message != '') {
                    this.$message.success(response.data.message);
                }
                this.parseResponse(action, response.data.data.data)
            })
            .catch(e => {
                this.log(e)
            })
        },
        parseResponse: function (action, response) {
            this.log(response)
        },
        checkPerm: function (perm) {
            return this.$root.store.perms.is_root || this.$root.store.perms[perm]
        },
        nl2br: function (value) {
            if (!value) return ''
            return value.replace(/([^>])\n/g, '$1<br>')
        },
    },
})

var store = {
    auth: false,
    perms: {},
    httpParams: {
        uid: null,
        sid: null,
    },
    init: false,
    test: false,
    login () {
        this.auth = true
    },
    logout () {
        this.auth = false
        this.httpParams.uid = null
        this.httpParams.sid = null
    }
}

var vm = new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>',
    data () {
        return {
            store: store
        }
    },
//    computed: {
//        perms: function () {
//                return this.store.perms
//            },
////        sid: () => { return this.$cookie.get('sid') || null },
//    },
//    computed: {
//    upperCase: () => {
//      return this.val.toUpperCase();
//    }  
//  }
    created() {
        this.store.httpParams.uid = this.$cookie.get('uid') || null
        this.store.httpParams.sid = this.$cookie.get('sid') || null
        HTTP.defaults.params = this.store.httpParams
        HTTP.interceptors.response.use((response) => {
            response.data.data.auth ? this.store.login() : this.store.logout()
            if (!response.data.success && response.data.message != '') {
                this.$message.error(response.data.message)
            }
            if (response.data.success && response.data.message != '') {
                this.$message.success(response.data.message)
            }
            return response.data.data.data
        }, function (error) {
            return Promise.reject(error)
        });
    }
});