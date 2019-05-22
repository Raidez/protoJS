# ProtoJS
Un projet perso un peu plus proche de mon usage personnelle, plus intéressant dans une certaine mesure que JQuery.

## Objectifs
**JQuery** est certe un excellent *couteau-suisse* pour faire toutes les manipulations du DOM avec Javascript.  
Cependant, l'objectif initial de JQuery est d'offrir une compatibilité avec *tous les navigateurs* (notamment **Internet Explorer**).  
De ce fait, la bilibothèque est *très lourde à importer* et ses performances ne sont pas *optimisées*.  

Mon projet ne se concentre pas sur la compatibilité, mais uniquement sur l'implémentation
des fonctionnalités de base permettant de raccourcir le code Javascript (trouver un élement, attacher un événement, etc).

## Fonctionnalités
### Récupération d'élement
La récupération d'élement se fait avec le classique signe dollar *$*, mais en 3 variantes.

A partir de la base HTML :
```
<div>
	<h1> Présentation </h1>
	<p>
		Ce framework est vraiment <i id="incredible">extraordinaire</i>.
	</p>
	<p>
		Après avoir vu ça, on peut mourir tranquille !
	</p>
</div>
```

```
$('incredible');	-> récupère l'élement avec l'id 'incredible'
$$('p');			-> récupère tout les paragraphes
$$$('p');			-> ne récupère que le 1er paragraphe
```

Ces 3 variantes permettent de bien séparer selon les élements attendus :
* $ -> recherche par identifiant uniquement (pas besoin de rajouter le caractère '#' au début)
* $$ -> recherche tout les élements correspondant à la requête
* $$$ -> ne récupère que le 1er élements de la requête (permet d'éviter de toujours renvoyer le 1er élement d'une liste)

### Manipulation
La récupération d'élement renvoi soit un **Element**, soit une **Collection**.
Ces objets contiennent différentes méthodes pour manipuler les élements.

**TODO**