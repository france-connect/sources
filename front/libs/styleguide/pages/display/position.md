!> Un élément avec un `position: absolute` doit toujours être contenu dans un parent avec un `position:relative`.

#### .is-absolute

<pre class="docsify-example">
  <div style="position:relative;height:150px;">
    <div class="is-absolute" style="right:20px;bottom:20px;">
      <p>L'élément est retiré du flux normal et aucun espace n'est créé pour l'élément sur la page. Il est ensuite positionné par rapport à son ancêtre le plus proche qui est positionné s'il y en a un ou par rapport au bloc englobant initial sinon. La position finale de l'élément est déterminée par les valeurs de top, right, bottom et left.</p>
      <p style="margin-top:20px;">Cette valeur crée un nouveau contexte d'empilement lorsque z-index ne vaut pas auto. Les éléments positionnés de façon absolue peuvent avoir des marges, ces marges ne fusionnent pas avec les autres marges.</p>
    </div>
  </div>
</pre>

> [source](https://developer.mozilla.org/fr/docs/Web/CSS/position#positionnement_absolu)

#### .is-fixed

<pre class="docsify-example">
  <div>
    <p>L'élément est retiré du flux normal et aucun espace n'est laissé pour l'élément. L'élément est positionné relativement au bloc englobant initial formé par la zone d'affichage (viewport), sauf si un des ancêtres a une propriété transform, perspective ou filter qui est différente de none (voir la spécification sur les transformations CSS) ; dans ce cas, c'est l'élément ancêtre qui joue le rôle de bloc englobant. Cela empêche le défilement lorsque la page est parcourue (ou lors de l'impression, le positionne à cette position fixe pour chaque page). Cette valeur crée toujours un nouveau contexte d'empilement. Certains incohérences existent entre les navigateurs quant au rôle de perspective et filter pour la définition du bloc englobant. La valeur finale de l'élément est déterminée par les valeurs de top, right, bottom et left.</p>
    <p>Cette valeur crée toujours un nouveau contexte d'empilement. Pour les documents imprimés, cela se traduit par le placement de l'élément au même endroit pour chacune des pages</p>
  </div>
</pre>

> [source](https://developer.mozilla.org/fr/docs/Web/CSS/position#positionnement_fixe)

#### .is-relative

<pre class="docsify-example">
  <div style="position:relative;height:150px;">
    <div class="is-relative" style="left:-20px;top:-20px;">
      <p>L'élément est positionné dans le flux normal du document puis décalé, par rapport à lui-même, selon les valeurs fournies par top, right, bottom et left. Le décalage n'a pas d'impact sur la position des éléments. Aussi, l'espace fourni à l'élément sur la page est le même que celui fourni avec static.</p>
      <p style="margin-top:20px;">Cette valeur crée un nouveau contexte d'empilement lorsque z-index ne vaut pas auto. L'effet de cette valeur n'est pas défini pour les éléments table-*-group, table-row, table-column, table-cell et table-caption.</p>
    </div>
  </div>
</pre>

> [source](https://developer.mozilla.org/fr/docs/Web/CSS/position#positionnement_relatif)

#### .is-sticky

<pre class="docsify-example">
  <div style="position:relative;height:150px;overflow-y:scroll;">
    <div>
      <h6 class="is-sticky" style="top:0px;">
        Scrollez dans le bloc (ceci n'est pas un bug)
      </h6>
      <p style="margin-top:20px;">La position de la boîte est calculée en fonction du flux normal du document. Ensuite, la boîte est décalée par rapport à son ancêtre de défilement le plus proche et par rapport à son bloc englobant selon les valeurs de top, right, bottom et left. Dans tous les cas, y compris avec les éléments table, cela n'affecte pas la position des autres éléments.</p>
      <p style="margin-top:20px;">Cette valeur entraîne toujours la création d'un nouveau contexte d'empilement. On notera qu'un tel élément « adhèrera » à l'ancêtre le plus proche qui dispose d'un mécanisme de défilement (c'est-à-dire quand overflow vaut hidden, scroll, auto ou overlay) même si cet ancêtre n'est pas nécessairement l'ancêtre de défilement le plus proche : cette valeur ne fonctionnera pas dans un élément pour lequel la propriété vaut overflow: hidden ou auto.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sed posuere orci, quis luctus leo. Sed eget pellentesque ipsum. Vivamus vitae nisi arcu. Cras vitae ullamcorper erat. Quisque et lorem quis felis tempus eleifend vitae sed ex. Praesent placerat magna id arcu blandit, ac efficitur nibh bibendum. Vestibulum lacinia quis felis convallis bibendum. Sed dui tortor, laoreet non orci ac, facilisis ultrices odio. Praesent at erat nunc. Aliquam tortor lorem, viverra nec leo at, sollicitudin bibendum est. Vivamus in tempus lacus. Nullam pharetra lectus ligula, in semper diam blandit in. Etiam at est vitae nulla facilisis luctus et non nunc.</p>
      <p>Praesent laoreet sed risus eu rutrum. Mauris lacinia arcu justo, ut tristique tellus elementum eget. Suspendisse vulputate elit eu cursus venenatis. Fusce lobortis lobortis aliquam. Duis interdum mi vitae euismod vulputate. Nunc nec aliquam leo. Donec molestie metus in sem dictum, a eleifend turpis posuere. Etiam euismod pulvinar auctor. Fusce vestibulum quam ac accumsan ornare. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean eget velit arcu. Fusce commodo nec dui vitae pretium. Maecenas non pretium ex.</p>
      <p>Curabitur viverra fermentum tortor, vel venenatis ex. Sed egestas nec risus id gravida. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris congue libero et neque auctor aliquam. Nulla cursus lorem in lorem placerat, quis vehicula nunc lobortis. Nulla facilisi. Curabitur et interdum orci. Nunc lacus purus, lacinia eget scelerisque eget, lacinia eu ex. Integer porttitor mi eu ante interdum, eget sollicitudin velit rutrum. Sed sit amet ante vel ligula feugiat volutpat. Nam placerat dolor bibendum nunc congue porttitor. Curabitur ullamcorper sit amet leo eget mollis. Vestibulum sed iaculis est. Phasellus nec eros ut ligula placerat auctor id sagittis nunc. In tempus elit eget odio varius, et vehicula nibh tristique. Pellentesque consectetur, ante nec lacinia rhoncus, quam ante dignissim libero, eu iaculis enim sapien tempor ipsum.</p>
    </div>
  </div>
</pre>

?> Voir l'exemple appliqué à un [`sticky footer`](/pages/layout/sticky)

> [source](<https://developer.mozilla.org/fr/docs/Web/CSS/position#positionnement_adh%C3%A9rent_(sticky)>)
