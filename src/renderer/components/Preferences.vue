<template>
  <el-container id="preferences">
    <el-header class="header">
      <el-row>
        <el-col :span="23">
          <h3>Preferences</h3>
        </el-col>
        <el-col :span="1">
          <el-button type="text" icon="el-icon-close" @click="close" class="close-button"></el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="240px" class="menu">
        <el-menu
          :default-active="defaultActive"
          class="setting-menu"
          :route="true">
          <el-menu-item index="1" :route="{path: '/preferences/general'}" @click="general">
            <icon name="cog" class="icon" scale="1.3"></icon>
            <span>General</span>
          </el-menu-item>
          <el-menu-item index="2" :route="{path: '/preferences/account'}" @click="account">
            <icon name="user" class="icon" scale="1.3"></icon>
            <span>Account</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'preferences',
  computed: {
    ...mapState({
      defaultActive: state => state.Preferences.defaultActive
    })
  },
  methods: {
    close () {
      this.$router.push('/')
    },
    general () {
      this.$router.push('/preferences/general')
    },
    account () {
      this.$router.push('/preferences/account')
    }
  }
}
</script>

<style lang="scss" scoped>
#preferences {
  height: 100%;
}

.header {
  text-align: center;
  border-bottom: 1px solid #dcdfe6;

  .close-button {
    font-size: 24px;
  }
}

.menu {
  text-align: right;
  padding-left: 24px;

  .setting-menu /deep/ {
    height: 100%;

    .icon {
      margin-right: 9px;
    }

    .el-menu-item {
      .icon {
        color: #909399;
      }
    }

    .is-active {
      .icon {
        color: #409eff;
      }
    }
  }

}
</style>
