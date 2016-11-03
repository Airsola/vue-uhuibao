<style lang="sass" scoped>
.location-map {
  height: calc(100vh - .5rem);
}
.location-bar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  h5 {
    font-size: .16rem;
    margin-bottom: .06rem;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  p {
    color: #999;
  }
  a {
    border: solid 1px #2cbcff;
    line-height: .28rem;
    padding: 0 .08rem;
    display: inline-block;
    border-radius: .02rem;
    font-size: .14rem;
    color: #2cbcff;
    position: absolute;
    right: .2rem;
    top: 50%;
    transform: translateY(-50%);
    &:before {
      margin-right: .04rem;
    }
  }
}
.location-bar h5,.location-bar p {
  max-width: 2.2rem;
  line-height: 1.1em;
  height: 1.1em;
  overflow: hidden;
}
</style>
<style lang="sass">
.anchorBL,.BMap_cpyCtrl,.pano_pc_indoor_exit,.pano_close {
  display: none !important;
}
.map-marker {
  font-size: .2rem;
  position: absolute;
  color: #eb5e55;
  line-height: 1em;
  &:after {
    width: .1rem;
    height: .03rem;
    content: '';
    display: block;
    background-color: rgba(0,0,0,.3);
    border-radius: 50%;
    position: absolute;
    bottom: -.015rem;
    left: 50%;
    margin-left: -.05rem;
    z-index: 0;
  }
  &:before {
    background-color: #fff;
    width: .12rem;
    height: .16rem;
    background-color: #fff;
    border-radius: 50%;
    content: '';
    display: block;
    position: absolute;
    z-index: 0;
    left: 50%;
    margin-left: -.06rem;
  }
  & > i {
    position: relative;
    z-index: 1;
  }
}
</style>
<template>
  <layout>
    <layout-header :title="shopName" :search="false"></layout-header>
    <layout-body>
      <div id="map-container" class="location-map"></div>
      <div class="location-bar ui-card-overline">
        <div class="ui-card ui-card-padd ui-card-pos-rel">
          <h5 class="t-bold">{{storeName}}</h5>
          <p>{{storeAddress}}</p>
          <a href="http://map.baidu.com/mobile/webapp/index/index/tab=line" class="iconfont i-compass-bfo">{{lang.seeRoadLine}}</a>
        </div>
      </div>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../layout';
import {Http, LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    title: '商家位置',
    seeRoadLine: '查看路线'
  },
  'zh-tw': {
    title: '商家位置',
    seeRoadLine: '查看路線'
  }
};
const language = Language[LANG_TYPE];
const BMap = window.BMap;
class CustomOverlay extends BMap.Overlay {
  constructor(map, point) {
    super();
    this._div = document.createElement('div');
    this._map = map;
    this._point = point;
  }
  initialize(map, point) {
    const icon = document.createElement('i');

    icon.className = 'iconfont i-location-bfo';

    this._div.className = 'map-marker';
    this._div.appendChild(icon);
    map.getPanes().labelPane.appendChild(this._div);

    return this._div;
  }
  draw() {
    const pixel = this._map.pointToOverlayPixel(this._point);
    const style = this._div.style;

    style.left = pixel.x + 'px';
    style.top = pixel.y + 'px';
    style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
  }
};

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody
  },
  data() {
    return {
      storeName: '',
      storeAddress: '',
      lang: language
    };
  },
  beforeRouteEnter(to, from, next) {
    Http.fetch('shop/get_location_info', {
      shop_id: to.params.shop_id,
      store_id: to.params.store_id
    }).then(response => {
      Http.resolve(response, (error, result) => {
        if (error) {
          next(false);
          throw result;
        } else {
          if (result.status === 1) {
            next(vm => {
              vm.$set(vm, 'storeName', result.data.name);
              vm.$set(vm, 'storeAddress', result.data.detail_area);

              const map = new BMap.Map('map-container');
              const point = new BMap.Point(result.data.longitude, result.data.latitude);

              map.centerAndZoom(point, 20);
              map.addOverlay(new CustomOverlay(map, point));
            });
          } else {
            next({path: '/404'});
            throw result.msg;
          };
        };
      });
    });
  },
  watch: {
    $route: function(to, from) {
      Http.fetch('shop/get_location_info', {
        shop_id: to.params.shop_id,
        store_id: to.params.store_id
      }).then(response => {
        Http.resolve(response, (error, result) => {
          if (error) {
            throw result;
          } else {
            if (result.status === 1) {
              this.$set(this, 'storeName', result.data.name);
              this.$set(this, 'storeAddress', result.data.detail_area);

              const map = new BMap.Map('map-container');
              const point = new BMap.Point(result.data.longitude, result.data.latitude);

              map.centerAndZoom(point, 20);
              map.addOverlay(new CustomOverlay(map, point));
            } else {
              this.$router.replace({path: '/404'});
              throw result.msg;
            };
          };
        });
      });
    }
  }
};
</script>
