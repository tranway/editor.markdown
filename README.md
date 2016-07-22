# edit.marketdown
它是一个基于PC桌面的MarketDown的文本编辑器。在windows10中文版环境下开发。这个说明文档就是用它进行编辑的。
***
![Alt text](https://github.com/guot/edit.marketdown/blob/master/screenshot/screenshot1.PNG?raw=true)

## 已实现的功能
 
- 多文件编辑
- 语法高亮
- 文件外部修改检测
- 实时预览

## 使用的开源框架及组件

1. [nodejs]() 
2. [electron]() 可以用js开发桌面应用
3. [angularjs]() mvvm 框架
4. [codeMirror]() js文本编辑组件
5. [gulp]() 后端编译打包工具
6. [bower]() 前端包引用工具
7. [scss]() CSS编译程序
8. [flat-ui]() UI界面组件
9. [font-awesome]() 矢量字体集

## 待开发功能

1. 文件保存[已完成]
2. 版本发布
3. 实时预览[已完成]
4. 通用搜索功能
5. 新建空白文档
6. 全部保存
 
## 项目开发环境依赖
-   nodejs ^6.2.2    
-   npm ^3.10.3      
-   electron 1.2.5      

## 程序运行
### 初始安装
 打开命令行窗口如powershell输入以下命令。   
> ·git clone https://github.com/guot/edit.marketdown.git   
> ·cd guot/edit.marketdown   
> .npm install   
> .gulp  build:init   

### 开发实时编译预览
`
gulp   
`   

不能关闭窗口，程序会一直监控原代码的修改，并动态编译。
### 运行
新打开命令窗口
`
cd edit.marketdown
./start.ps1
`

## 变更列表
2016.7.22 完成文件保存、实时预览、预览窗口跟随、窗口位置记忆功能。




