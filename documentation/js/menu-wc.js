'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">gacela-frontend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-6f01dbe65e1e0659f6f92be18c81c425"' : 'data-target="#xs-components-links-module-AppModule-6f01dbe65e1e0659f6f92be18c81c425"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-6f01dbe65e1e0659f6f92be18c81c425"' :
                                            'id="xs-components-links-module-AppModule-6f01dbe65e1e0659f6f92be18c81c425"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BuscarProyventasolDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BuscarProyventasolDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CalendarioComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CalendarioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetproyventasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DetproyventasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogListarNavesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DialogListarNavesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogRegistrarNavesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DialogRegistrarNavesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForecastComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ForecastComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GatesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GatesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImagenUsuarioComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ImagenUsuarioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavBarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotFoundPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotFoundPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OutstandingComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OutstandingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PasswordComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PerfilComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PerfilComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProyeccionesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProyeccionesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProyventasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProyventasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroNavesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegistroNavesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Rep6040Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Rep6040Component</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RetirosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RetirosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SideBarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SideBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StatusBarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StatusBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TransbordoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TransbordoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsuarioComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsuarioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WelcomePageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">WelcomePageComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-AppModule-6f01dbe65e1e0659f6f92be18c81c425"' : 'data-target="#xs-directives-links-module-AppModule-6f01dbe65e1e0659f6f92be18c81c425"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-AppModule-6f01dbe65e1e0659f6f92be18c81c425"' :
                                        'id="xs-directives-links-module-AppModule-6f01dbe65e1e0659f6f92be18c81c425"' }>
                                        <li class="link">
                                            <a href="directives/MayusculaDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">MayusculaDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-AppModule-6f01dbe65e1e0659f6f92be18c81c425"' : 'data-target="#xs-pipes-links-module-AppModule-6f01dbe65e1e0659f6f92be18c81c425"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-6f01dbe65e1e0659f6f92be18c81c425"' :
                                            'id="xs-pipes-links-module-AppModule-6f01dbe65e1e0659f6f92be18c81c425"' }>
                                            <li class="link">
                                                <a href="pipes/CapitalizadoPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CapitalizadoPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/FechaPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FechaPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link">MaterialModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/FileCabMTC1R999.html" data-type="entity-link">FileCabMTC1R999</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileDetMTC1R999.html" data-type="entity-link">FileDetMTC1R999</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForecastCab.html" data-type="entity-link">ForecastCab</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForecastDet.html" data-type="entity-link">ForecastDet</a>
                            </li>
                            <li class="link">
                                <a href="classes/Linea.html" data-type="entity-link">Linea</a>
                            </li>
                            <li class="link">
                                <a href="classes/Log.html" data-type="entity-link">Log</a>
                            </li>
                            <li class="link">
                                <a href="classes/Login.html" data-type="entity-link">Login</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginModel.html" data-type="entity-link">LoginModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/Menu.html" data-type="entity-link">Menu</a>
                            </li>
                            <li class="link">
                                <a href="classes/Nave.html" data-type="entity-link">Nave</a>
                            </li>
                            <li class="link">
                                <a href="classes/Nave-1.html" data-type="entity-link">Nave</a>
                            </li>
                            <li class="link">
                                <a href="classes/Perfil.html" data-type="entity-link">Perfil</a>
                            </li>
                            <li class="link">
                                <a href="classes/Persona.html" data-type="entity-link">Persona</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProyeccionEquipoCab.html" data-type="entity-link">ProyeccionEquipoCab</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProyeccionEquipoDet.html" data-type="entity-link">ProyeccionEquipoDet</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProyeccionFileCab.html" data-type="entity-link">ProyeccionFileCab</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProyeccionFileDet.html" data-type="entity-link">ProyeccionFileDet</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProyeccionModel.html" data-type="entity-link">ProyeccionModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProyeccionVentaCab.html" data-type="entity-link">ProyeccionVentaCab</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProyeccionVentaDet.html" data-type="entity-link">ProyeccionVentaDet</a>
                            </li>
                            <li class="link">
                                <a href="classes/Puerto.html" data-type="entity-link">Puerto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RatioDevolucion.html" data-type="entity-link">RatioDevolucion</a>
                            </li>
                            <li class="link">
                                <a href="classes/RpoPlan.html" data-type="entity-link">RpoPlan</a>
                            </li>
                            <li class="link">
                                <a href="classes/Servicio.html" data-type="entity-link">Servicio</a>
                            </li>
                            <li class="link">
                                <a href="classes/Servicio-1.html" data-type="entity-link">Servicio</a>
                            </li>
                            <li class="link">
                                <a href="classes/Submenu.html" data-type="entity-link">Submenu</a>
                            </li>
                            <li class="link">
                                <a href="classes/TipoDocumento.html" data-type="entity-link">TipoDocumento</a>
                            </li>
                            <li class="link">
                                <a href="classes/Token.html" data-type="entity-link">Token</a>
                            </li>
                            <li class="link">
                                <a href="classes/Usuario.html" data-type="entity-link">Usuario</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsuarioModel.html" data-type="entity-link">UsuarioModel</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/CalendarioService.html" data-type="entity-link">CalendarioService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigService.html" data-type="entity-link">ConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileMTC1R999Service.html" data-type="entity-link">FileMTC1R999Service</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileService.html" data-type="entity-link">FileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ForecastService.html" data-type="entity-link">ForecastService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LineasService.html" data-type="entity-link">LineasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoginService.html" data-type="entity-link">LoginService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MenuService.html" data-type="entity-link">MenuService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NavesService.html" data-type="entity-link">NavesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ParamsService.html" data-type="entity-link">ParamsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PasswordService.html" data-type="entity-link">PasswordService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PerfilService.html" data-type="entity-link">PerfilService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProyeccionEquipoService.html" data-type="entity-link">ProyeccionEquipoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProyeccionService.html" data-type="entity-link">ProyeccionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RpoPlanService.html" data-type="entity-link">RpoPlanService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ServicioService.html" data-type="entity-link">ServicioService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TidocService.html" data-type="entity-link">TidocService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsuarioService.html" data-type="entity-link">UsuarioService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Config.html" data-type="entity-link">Config</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataForecast.html" data-type="entity-link">DataForecast</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Dpw.html" data-type="entity-link">Dpw</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});