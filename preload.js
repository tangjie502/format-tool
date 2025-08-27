// uTools 插件预加载脚本

// 动态添加HTML标签匹配功能
function setupDynamicFeatures() {
  try {
    console.log("开始设置动态功能...", typeof utools);
    
    if (typeof utools === 'undefined') {
      console.error("utools 对象未定义");
      return;
    }
    
    if (typeof utools.setFeature !== 'function') {
      console.error("utools.setFeature 方法不存在");
      return;
    }
    
    console.log("utools对象可用，开始添加动态功能");
    
    // 添加一个简单的测试命令
    const testResult = utools.setFeature({
      code: "html-test-simple",
      explain: "测试动态功能",
      cmds: ["动态测试", "测试html", "htmltest"]
    });
    console.log("测试功能添加结果:", testResult);
    
    // 添加HTML标签匹配
    const divResult = utools.setFeature({
      code: "html-div-matcher",
      explain: "HTML DIV标签格式化",
      cmds: ["<div"]
    });
    console.log("DIV匹配添加结果:", divResult);
    
    const buttonResult = utools.setFeature({
      code: "html-button-matcher", 
      explain: "HTML BUTTON标签格式化",
      cmds: ["<button"]
    });
    console.log("BUTTON匹配添加结果:", buttonResult);
    
    // 检查已添加的功能
    const allFeatures = utools.getFeatures();
    console.log("=== 所有功能列表 ===");
    console.log("总数:", allFeatures.length);
    allFeatures.forEach((f, index) => {
      console.log(`${index + 1}. ${f.code}: ${f.explain}`);
      console.log("   指令:", f.cmds);
    });
    
    console.log("动态功能设置完成");
    return true;
  } catch (error) {
    console.error("设置动态功能失败:", error);
    return false;
  }
}

// 等待插件完全加载后再设置
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM加载完成，尝试设置动态功能");
  setTimeout(setupDynamicFeatures, 1000);
});

// 监听插件进入事件，在这个时候也尝试设置
utools.onPluginEnter(() => {
  console.log("插件进入，检查动态功能");
  const features = utools.getFeatures();
  if (features.length <= 1) {
    console.log("动态功能未设置，重新尝试");
    setupDynamicFeatures();
  }
});

window.exports = {
  "html-formatter": {
    mode: "none",
    args: {
      enter: (action, callbackSetList) => {
        console.log("HTML 格式化工具已启动", action);
        if (action && action.payload) {
          // 自动填充到输入框
          setTimeout(() => {
            const inputHtml = document.getElementById('inputHtml');
            if (inputHtml) {
              inputHtml.value = action.payload;
              // 自动切换到输出标签页进行格式化
              const outputTab = document.querySelector('[data-tab="output"]');
              if (outputTab) {
                outputTab.click();
              }
            }
          }, 100);
        }
      },
    },
  },
  "html-test-simple": {
    mode: "none", 
    args: {
      enter: (action, callbackSetList) => {
        console.log("动态测试命令进入成功！", action);
        alert("🎉 动态指令测试成功！说明动态功能可以正常工作。");
        setTimeout(() => {
          const inputHtml = document.getElementById('inputHtml');
          if (inputHtml) {
            inputHtml.value = "<div class='test'>动态指令测试成功！</div>";
            const outputTab = document.querySelector('[data-tab="output"]');
            if (outputTab) {
              outputTab.click();
            }
          }
        }, 100);
      },
    },
  },
  "html-div-matcher": {
    mode: "none", 
    args: {
      enter: (action, callbackSetList) => {
        console.log("通过DIV标签匹配进入", action);
        if (action && action.payload) {
          setTimeout(() => {
            const inputHtml = document.getElementById('inputHtml');
            if (inputHtml) {
              inputHtml.value = action.payload;
              const outputTab = document.querySelector('[data-tab="output"]');
              if (outputTab) {
                outputTab.click();
              }
            }
          }, 100);
        }
      },
    },
  },
  "html-button-matcher": {
    mode: "none", 
    args: {
      enter: (action, callbackSetList) => {
        console.log("通过BUTTON标签匹配进入", action);
        if (action && action.payload) {
          setTimeout(() => {
            const inputHtml = document.getElementById('inputHtml');
            if (inputHtml) {
              inputHtml.value = action.payload;
              const outputTab = document.querySelector('[data-tab="output"]');
              if (outputTab) {
                outputTab.click();
              }
            }
          }, 100);
        }
      },
    },
  },
};

// 监听插件进入事件
utools.onPluginEnter(({ code, type, payload }) => {
  console.log("插件进入:", { code, type, payload });
  
  // 如果是从剪贴板或文本匹配进入，自动填充内容
  if (payload) {
    setTimeout(() => {
      const inputHtml = document.getElementById('inputHtml');
      if (inputHtml) {
        inputHtml.value = payload;
        // 自动切换到输出标签页进行格式化
        const outputTab = document.querySelector('[data-tab="output"]');
        if (outputTab) {
          outputTab.click();
        }
      }
    }, 100);
  }
});

// 监听插件退出事件
utools.onPluginOut(() => {
  console.log("插件退出");
});
