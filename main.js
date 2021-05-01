var c = document.getElementById("my-canvas");
var ctx = c.getContext("2d");

make_base();

function make_base() {
  base_image = new Image();
  base_image.src = "images/background.jpg";
  base_image.onload = function () {
    ctx.drawImage(base_image, 0, 0, 1000, 600);
  };
}

let loadImage = (src, callback) => {
  let img = document.createElement("img");
  img.onload = () => callback(img);
  img.src = src;
};

let imagePath = (frameNumber, animation) => {
  return "images/" + animation + "/" + frameNumber + ".png";
};

let frames = {
  idle: [1, 2, 3, 4, 5, 6, 7, 8],
  kick: [1, 2, 3, 4, 5, 6, 7],
  punch: [1, 2, 3, 4, 5, 6, 7],
  backward: [1, 2, 3, 4, 5, 6],
  forward: [1, 2, 3, 4, 5, 6],
  block: [1, 2, 3, 4, 5, 6, 7, 8, 9],
};

let loadImages = (callback) => {
  let images = {
    idle: [],
    kick: [],
    punch: [],
    backward: [],
    forward: [],
    block: [],
  };
  let imagesToLoad = 0;
  ["idle", "kick", "punch", "forward", "backward", "block"].forEach(
    (animation) => {
      let animationframes = frames[animation];
      imagesToLoad = imagesToLoad + animationframes.length;
      animationframes.forEach((frameNumber) => {
        let path = imagePath(frameNumber, animation);
        loadImage(path, (image) => {
          images[animation][frameNumber - 1] = image;
          imagesToLoad = imagesToLoad - 1;

          if (imagesToLoad === 0) {
            callback(images);
          }
        });
      });
    }
  );
};
let animate = (ctx, images, animation, callback) => {
  images[animation].forEach((image, index) => {
    setTimeout(() => {
      ctx.clearRect(0, 0, 500, 500);
      ctx.drawImage(image, 200, 200, 300, 300);
    }, index * 100);
  });
  setTimeout(callback, images[animation].length * 100);
};
loadImages((images) => {
  let queuedAnimation = [];
  let aux = () => {
    let selectedAnimation;
    if (queuedAnimation.length === 0) {
      selectedAnimation = "idle";
    } else {
      selectedAnimation = queuedAnimation.shift();
    }
    animate(ctx, images, selectedAnimation, aux);
  };
  aux();

  document.getElementById("kick").onclick = () => {
    queuedAnimation.push("kick");
  };
  document.getElementById("backward").onclick = () => {
    queuedAnimation.push("backward");
  };
  document.getElementById("punch").onclick = () => {
    queuedAnimation.push("punch");
  };
  document.getElementById("forward").onclick = () => {
    queuedAnimation.push("forward");
  };
  document.getElementById("block").onclick = () => {
    queuedAnimation.push("block");
  };
  document.addEventListener("keyup", function (event) {
    const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    if (key === "k") {
      queuedAnimation.push("kick");
    } else if (key === "p") {
      queuedAnimation.push("punch");
    } else if (key === "ArrowRight") {
      queuedAnimation.push("forward");
    } else if (key === "b") {
      queuedAnimation.push("block");
    } else if (key === "ArrowLeft") {
      queuedAnimation.push("backward");
    }
  });
});
