import security from '../lib/security';
import ThemeService from '../services/theme/theme';
import ThemeSettingsService from '../services/theme/settings';
import ThemeAssetsService from '../services/theme/assets';
import ThemePlaceholdersService from '../services/theme/placeholders';

class ThemeRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/theme/export',
			security.checkUserScope.bind(this, security.scope.READ_THEME),
			this.exportTheme.bind(this)
		);
		this.router.post(
			'/v1/theme/install',
			security.checkUserScope.bind(this, security.scope.WRITE_THEME),
			this.installTheme.bind(this)
		);

		this.router.get(
			'/v1/theme/settings',
			security.checkUserScope.bind(this, security.scope.READ_THEME),
			this.getSettings.bind(this)
		);
		this.router.put(
			'/v1/theme/settings',
			security.checkUserScope.bind(this, security.scope.WRITE_THEME),
			this.updateSettings.bind(this)
		);
		this.router.get(
			'/v1/theme/settings_schema',
			security.checkUserScope.bind(this, security.scope.READ_THEME),
			this.getSettingsSchema.bind(this)
		);

		this.router.post(
			'/v1/theme/assets',
			security.checkUserScope.bind(this, security.scope.WRITE_THEME),
			this.uploadFile.bind(this)
		);
		this.router.delete(
			'/v1/theme/assets/:file',
			security.checkUserScope.bind(this, security.scope.WRITE_THEME),
			this.deleteFile.bind(this)
		);

		this.router.get(
			'/v1/theme/placeholders',
			security.checkUserScope.bind(this, security.scope.READ_THEME),
			this.getPlaceholders.bind(this)
		);
		this.router.post(
			'/v1/theme/placeholders',
			security.checkUserScope.bind(this, security.scope.WRITE_THEME),
			this.addPlaceholder.bind(this)
		);
		this.router.get(
			'/v1/theme/placeholders/:key',
			security.checkUserScope.bind(this, security.scope.READ_THEME),
			this.getSinglePlaceholder.bind(this)
		);
		this.router.put(
			'/v1/theme/placeholders/:key',
			security.checkUserScope.bind(this, security.scope.WRITE_THEME),
			this.updatePlaceholder.bind(this)
		);
		this.router.delete(
			'/v1/theme/placeholders/:key',
			security.checkUserScope.bind(this, security.scope.WRITE_THEME),
			this.deletePlaceholder.bind(this)
		);
	}

	exportTheme(req, res, next) {
		ThemeService.exportTheme(req, res);
	}

	installTheme(req, res, next) {
		ThemeService.installTheme(req, res);
	}

	async getSettings(req, res, next) {
		try {
			let data = await ThemeSettingsService.getSettings();
			return res.send(data);
		} catch(err) {
			return next(err);
		}
	}

	async updateSettings(req, res, next) {
		await ThemeSettingsService.updateSettings(req.body)
			.then(() => {
				return res.end();
			})
			.catch(next);
	}

	async getSettingsSchema(req, res, next) {
		await ThemeSettingsService.getSettingsSchema()
			.then(data => {
				return res.send(data);
			})
			.catch(next);
	}

	async uploadFile(req, res, next) {
		await ThemeAssetsService.uploadFile(req, res, next);
	}

	async deleteFile(req, res, next) {
		await ThemeAssetsService.deleteFile(req.params.file)
			.then(() => {
				return res.end();
			})
			.catch(next);
	}

	async getPlaceholders(req, res, next) {
		await ThemePlaceholdersService.getPlaceholders()
			.then(data => {
				return res.send(data);
			})
			.catch(next);
	}

	async getSinglePlaceholder(req, res, next) {
		await ThemePlaceholdersService.getSinglePlaceholder(req.params.key)
			.then(data => {
				if (data) {
					return res.send(data);
				} else {
					return res.status(404).end();
				}
			})
			.catch(next);
	}

	async addPlaceholder(req, res, next) {
		await ThemePlaceholdersService.addPlaceholder(req.body)
			.then(data => {
				return res.send(data);
			})
			.catch(next);
	}

	async updatePlaceholder(req, res, next) {
		await ThemePlaceholdersService.updatePlaceholder(req.params.key, req.body)
			.then(data => {
				if (data) {
					return res.send(data);
				} else {
					return res.status(404).end();
				}
			})
			.catch(next);
	}

	async deletePlaceholder(req, res, next) {
		await ThemePlaceholdersService.deletePlaceholder(req.params.key)
			.then(data => {
				return res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default ThemeRoute;
